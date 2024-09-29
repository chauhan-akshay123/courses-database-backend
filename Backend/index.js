let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Initialize SQLite database connection
(async () => {
  db = await open({
    filename: "./Backend/database.sqlite",
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// function to fetch all courses
async function fetchAllCourses(){
  let query = "SELECT * FROM courses";
  let response = await db.all(query, []);
  return { courses: response };
}

// Route to fetch all courses
app.get("/courses", async (req, res)=>{
  try{
    const results = await fetchAllCourses();
     
    if(results.courses.length === 0){
      res.status(404).json({ message: "No Courses Found" });
    }

    res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
})

// function to fetch all courses by instructor
async function fetchCoursesByInstructor(instructor){
  let query = "SELECT id, title, instructor, category FROM courses WHERE instructor = ?";
  let response = await db.all(query, [instructor]);
  return { courses: response };
}

// Route to fetch all courses by Instructor
app.get("/courses/instructor/:instructor", async (req, res)=>{
 let instructor = req.params.instructor;
 try{
   const results = await fetchCoursesByInstructor(instructor);
    
   if(results.courses.length === 0){
     res.status(404).json({ message: "No Courses Found For Instructor: " + instructor });
   }

   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch courses by category
async function fetchCoursesByCategory(category){
  let query = "SELECT id, title, category, release_year FROM courses WHERE category = ?";
  let response = await db.all(query, [category]);
  return { courses: response };
}

// Route to fetch courses by category
app.get("/courses/category/:category", async (req, res)=>{
  let category = req.params.category;
  try{
    const results = await fetchCoursesByCategory(category);
    
    if(results.courses.length === 0){
      res.status(404).json({ message: "No Courses Found For this Category: " + category });
    }

    res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
});

// function to fetch courses by year
async function fetchCoursesByYear(year){
  let query = "SELECT id, title, category, release_year FROM courses WHERE release_year = ?";
  let response = await db.all(query, [year]);
  return { courses: response };
}

// Route to fetch courses by year
app.get("/courses/year/:year", async (req, res)=>{
 let year = req.params.year
 try{
   const results = await fetchCoursesByYear(year);
   
   if(results.courses.length === 0){
     res.status(404).json({ message: "No Courses Found for the Year: " + year});
   }

 res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

