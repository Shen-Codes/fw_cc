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
	ID              int    `dynamodbav:"ID" json:"id"`
	Description     string `dynamodbav:"Description" json:"description"`
	TransactionType string `dynamodbav:"TransactionType" json:"transactiontype"`
	Amount          int    `dynamodbav:"Amount" json:"amount"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
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
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

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

	totalStruct, assetsStruct, liabilitiesStruct := calculate(unMarshList)

	unMarshList = append(unMarshList, totalStruct, assetsStruct, liabilitiesStruct)
	jsonBytes, _ := json.Marshal(unMarshList)

	w.Header().Add("content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
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

	getTransactions(dynaSvc, w, r)
}

func deleteTransaction(dynaSvc dynamodb.DynamoDB, w http.ResponseWriter, r *http.Request) {
	item := marshalTransaction(w, r)

	//pull out just the id to pass to DeleteItemInput
	key := map[string]*dynamodb.AttributeValue{
		"ID": item["ID"],
	}
	tableName := "Transactions"

	input := &dynamodb.DeleteItemInput{
		Key:       key,
		TableName: aws.String(tableName),
	}

	_, err := dynaSvc.DeleteItem(input)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		fmt.Printf("%v", err)
		return
	}

	getTransactions(dynaSvc, w, r)
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
	fmt.Printf("%v", transaction)
	//create map of transaction of type *dyDBattribute
	item, err := dynamodbattribute.MarshalMap(transaction)
	if err != nil {
		fmt.Println("Got error marshalling new movie item:")
		fmt.Println(err.Error())
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

func calculate(list []Transaction) (Transaction, Transaction, Transaction) {
	var total, assets, liabilities int
	for _, item := range list {
		if item.TransactionType == "asset" {
			total += item.Amount
			assets += item.Amount
		} else {
			total -= item.Amount
			liabilities += item.Amount
		}
	}

	totalStruct := Transaction{
		0, "total", "neither", total,
	}
	assetsStruct := Transaction{
		0, "assets", "neither", assets,
	}
	liabilitiesStruct := Transaction{
		0, "liabilities", "neither", liabilities,
	}

	return totalStruct, assetsStruct, liabilitiesStruct
}
