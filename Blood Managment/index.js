import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blood",
    password: "12345",
    port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("Home Page.html");
});
app.post("/login", async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    // Perform validation if needed

    // Check if email already exists
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkResult.rows.length > 0) {
        res.send("Email already exists");
    } else {
        // Insert user data into the database
        const result = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)", [name, email, password, role]
        );

        console.log(result);
        res.render("About.ejs", { successMessage: "User registered successfully", errors: {} });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



// if (empty($name))
//    {
//     $errors['name'] = "Username is required.";
// }
// elseif(!ctype_alpha(str_replace(' ', '', $username))) 
// {
//         $errors['name'] = "Username can only contain letters.";
//     }
//     // Validate password
// if (empty($password)) 
//   {
//     $errors['password'] = "Password is required.";
// }
// elseif(strlen($password) < 6)
//  {
//         $errors['password'] = "Password should be at least 6 characters long.";
//     }
//     // Validate role
// if (empty($role))
//    {
//     $errors['role'] = "Role is required.";
// }
// // Validate email
// if (empty($email)) 
//   {
//     $errors['email'] = "Email is required.";
// }
// elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) 
// {
//         $errors['email'] = "Please enter a valid email address.";
//     }
//     // Check if there are any errors
// if (count($errors) > 0) {
//     $_SESSION['errors'] = $errors;
//     header("Location: ../../views/auth/login.php?err=".urlencode(json_encode($errors)));
//     exit();
// }