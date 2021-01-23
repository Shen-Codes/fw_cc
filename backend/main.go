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
	Description     string `json:"description"`
	TransactionType string `json:"transactiontype"`
	Amount          int    `json:"Amount"`
}

func handleTransaction(dynaSvc dynamodb.DynamoDB) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			getTransactions(dynaSvc)
			return
		case "POST":
			postTransaction(dynaSvc)
			return
		default:
			return
		}
	})
}

func getTransactions(dynaSvc dynamodb.DynamoDB) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	})
}

func postTransaction(dynaSvc dynamodb.DynamoDB) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//parse out body into []byte type
		body, err := ioutil.ReadAll(r.Body)
		defer r.Body.Close()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			fmt.Printf("%v", err)
			return
		}

		//un-json's the request body
		var transaction Transaction
		err = json.Unmarshal(body, &transaction)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		tableName := "Transactions"

		//create map of transaction of type *dyDBattribute
		item, err := dynamodbattribute.MarshalMap(transaction)
		if err != nil {
			fmt.Println("Got error marshalling new movie item:")
			fmt.Println(err.Error())
			os.Exit(1)
		}

		//create dyDB input format
		input := &dynamodb.PutItemInput{
			Item:      item,
			TableName: aws.String(tableName),
		}
		_, err = dynaSvc.PutItem(input)
		if err != nil {
			fmt.Println("Got error calling PutItem:")
			fmt.Println(err.Error())
			os.Exit(1)
		}
	})
}

func main() {
	//a session must be initialized and passed to new service clienct in order for service calls to be made
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	//initializing new DynamoDB client
	dynaSvc := dynamodb.New(sess)

	mux := http.NewServeMux()
	mux.HandleFunc("/", handleTransaction(*dynaSvc))
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
