package db_n_router_init

import (
  . "backEND/types"
  "database/sql"
  "encoding/json"
  "fmt"
  "io/ioutil"
  "log"
  "strconv"

  _ "github.com/go-sql-driver/mysql"
  //"fmt"
  "github.com/gorilla/mux"

  //"io/ioutil"
  "net/http"
)

//Db configuration
var db *sql.DB

const dbDataSource string = "root:root@tcp(127.0.0.1:3306)/users_db"
const httpAddr string = "127.0.0.1:9080"

func InitDB() {
	var err error
	db, err = sql.Open("mysql", dbDataSource)
	if err != nil {
		panic(err.Error())
	}
}

func Routes() {
	InitDB()
	defer db.Close()
	log.Println("Starting the HTTP server on " + httpAddr)

	router := mux.NewRouter()


	router.HandleFunc("/users",
		GetUsers).Methods("GET")

	router.HandleFunc("/users",
		CreateUser).Methods("POST")

  router.HandleFunc("/users/{id}",
		GetUser).Methods("GET")

  router.HandleFunc("/users/{id}",
		UpdateUser).Methods("PUT")

  router.HandleFunc("/users/{id}",
		DeleteUser).Methods("DELETE")

	http.ListenAndServe(httpAddr, &CORSRouter{router})
}

/***************************************************/

func GetUsers(w http.ResponseWriter, r *http.Request) {
	result , err := db.Query(
	  `SELECT id, first_name, last_name, email
           from users`)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()

	var users []User
	for result.Next() {
		var user User
		err := result.Scan(&user.ID, &user.FirstName,
			&user.LastName, &user.Email)
		if err != nil {
			panic(err.Error())
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "text/plain; charset=utf-8")

	stmt, err := db.Prepare("INSERT INTO users(first_name," +
		"last_name,email) VALUES(?,?,?)")
	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)

	first_name := keyVal["firstName"]
	last_name := keyVal["lastName"]
	email := keyVal["email"]

  result, err := stmt.Exec(first_name, last_name, email)
	if err != nil {
		panic(err.Error())
	}
  rowPK, _ := result.LastInsertId()
  keyVal["id"] = strconv.Itoa(int(rowPK))

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(keyVal)

	//fmt.Fprintf(w, "New user was created %s, %s, %s", first_name, last_name, email)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, first_name, last_name, email from users WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()

	var user User
	for result.Next() {
		err := result.Scan(&user.ID, &user.FirstName,
			&user.LastName, &user.Email)
		if err != nil {
			panic(err.Error())
		}
	}

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(user)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := db.Prepare("UPDATE users SET first_name = ?, last_name= ?, email=? WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}

	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)

	first_name := keyVal["firstName"]
	last_name := keyVal["lastName"]
	email := keyVal["email"]
	_, err = stmt.Exec(first_name, last_name, email, params["id"])
	if err != nil {
		panic(err.Error())
	}

	keyVal["id"] = params["id"]
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(keyVal)
  //fmt.Fprintf(w, "User with ID = %s was updated", params["id"])


  //json.NewEncoder(w).Encode(user)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	stmt, err := db.Prepare("DELETE FROM users WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}

  w.Header().Set("Content-Type", "text/pain")
  fmt.Fprintf(w, "User with ID = %s was deleted",
		params["id"])
}
