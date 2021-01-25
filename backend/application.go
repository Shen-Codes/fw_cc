package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

//Transaction struct type for json response/request
type Transaction struct {
	ID              string `dynamodbav:"ID" json:"id"`
	Description     string `dynamodbav:"Description" json:"description"`
	TransactionType string `dynamodbav:"TransactionType" json:"transactiontype"`
	Amount          int    `dynamodbav:"Amount" json:"amount"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	//a session must be initialized and passed to new service clienct in order for service calls to be made
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
		Config: aws.Config{
			Region: aws.String("us-east-1"),
		},
	}))

	//initializing new DynamoDB client
	dynaSvc := dynamodb.New(sess)

	http.HandleFunc("/", handleTransaction(*dynaSvc))
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		panic(err)
	}
}

func handleTransaction(dynaSvc dynamodb.DynamoDB) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			getTransactions(dynaSvc, w, r)
			return
		case "POST":
			postTransaction(dynaSvc, w, r)
			return
		case "DELETE":
			deleteTransaction(dynaSvc, w, r)
			return
		default:
			// TODO
			return
		}
	})
}

func getTransactions(dynaSvc dynamodb.DynamoDB, w http.ResponseWriter, r *http.Request) {
	response, err := queryTransactions(dynaSvc)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	// unMarsh := []Transaction{}
	// dynamodbattribute.UnmarshalListOfMaps(response, &unMarsh)

	//wonky marshalling of response since dbatt.unmarshallistofmaps not behaving as expected
	unMarshList := []Transaction{}
	for _, item := range response {
		unMarsh := Transaction{}
		dynamodbattribute.UnmarshalMap(item, &unMarsh)
		unMarshList = append(unMarshList, unMarsh)
	}

	total := calculateTotal(unMarshList)
	jsonBytes, _ := json.Marshal(unMarshList)
	totalBytes, _ := json.Marshal(total)

	w.Header().Add("content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
	w.Write(totalBytes)

}

func postTransaction(dynaSvc dynamodb.DynamoDB, w http.ResponseWriter, r *http.Request) {
	item := marshalTransaction(w, r)
	tableName := "Transactions"

	//create dyDB input format
	input := &dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(tableName),
	}
	_, err := dynaSvc.PutItem(input)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
}

func deleteTransaction(dynaSvc dynamodb.DynamoDB, w http.ResponseWriter, r *http.Request) {
	item := marshalTransaction(w, r)
	tableName := "Transactions"

	input := &dynamodb.DeleteItemInput{
		Key:       item,
		TableName: aws.String(tableName),
	}

	_, err := dynaSvc.DeleteItem(input)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}

func marshalTransaction(w http.ResponseWriter, r *http.Request) map[string]*dynamodb.AttributeValue {
	//parse out body into []byte type
	body, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		fmt.Printf("%v", err)
	}

	//un-json the request body
	var transaction Transaction
	json.Unmarshal(body, &transaction)

	//create map of transaction of type *dyDBattribute
	item, err := dynamodbattribute.MarshalMap(transaction)
	if err != nil {
		fmt.Println("Got error marshalling new movie item:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	return item
}

func queryTransactions(dynaSvc dynamodb.DynamoDB) ([]map[string]*dynamodb.AttributeValue, error) {
	//saved myself a bit of time and used scan instead of dynaDb's query feature
	var scanInput = &dynamodb.ScanInput{
		TableName:       aws.String("Transactions"),
		AttributesToGet: aws.StringSlice([]string{"ID", "Amount", "Description", "TransactionType"}),
	}
	var response, err = dynaSvc.Scan(scanInput)
	if err != nil {
		return nil, err
	}

	return response.Items, nil
}

func calculateTotal(list []Transaction) int {
	var total int
	for _, item := range list {
		if item.TransactionType == "asset" {
			total += item.Amount
		} else {
			total -= item.Amount
		}
	}

	return total
}
