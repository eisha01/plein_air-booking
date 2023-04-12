const sql = require('mssql/msnodesqlv8');
const express = require('express');

const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Configure middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure database connection settings
const config = {
  database: 'PleinAir_Booking',
  server: 'LAPTOP-F1DLTNIK\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  },
};

app.get('/api/caravans', async (req, res) => {
  try {
    const getCaravans = async () => {
      try {
        let pool = await sql.connect(config);
        let Caravans = pool.request().query('SELECT * FROM Caravans');
        console.log(Caravans);
        return Caravans;
      } catch (error) {
        console.log(error);
      }
    };
    getCaravans().then((res) => {
      console.log(res.recordset);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route for creating a new caravan in the database
app.post('/api/caravans', async (req, res) => {
  const caravan = req.body;
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `INSERT INTO Caravans VALUES (${caravan.CaravanID},'${caravan.Name}','${caravan.Description}','${caravan.Type}','${caravan.Manager}',${caravan.AccommodationCount},'${caravan.AdditionalExtension}')`
      );
    console.log(result);
    class Caravan {
      constructor(
        CaravanID,
        Name,
        Description,
        Type,
        Manager,
        AccommodationCount,
        AdditionalExtension
      ) {
        this.CaravanID = CaravanID;
        this.Name = Name;
        this.Type = Type;
        this.Description = Description;
        this.Manager = Manager;
        this.AccommodationCount = AccommodationCount;
        this.AdditionalExtension = AdditionalExtension;
      }
    }
    const newCaravan = new Caravan(
      caravan.CaravanID,
      caravan.Name,
      caravan.Description,
      caravan.Type,
      caravan.Manager,
      caravan.AccommodationCount,
      caravan.AdditionalExtension
    );
    console.log(newCaravan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route for getting all caravans from the database
app.get('/available/caravans', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Caravans');

    // Build the HTML string dynamically
    let html = `
  <div style="text-align: center;">
    <h2 style="margin-bottom: 20px;">Available caravans</h2>
    <ul style="list-style-type: none; padding: 0; margin: 0;">
      ${result.recordset
        .map(
          (caravan) => `
        <li style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">${caravan.Name} (${caravan.Type}) - ${caravan.Description}</li>
      `
        )
        .join('')}
    </ul>
  </div>
`;

    // Send the HTML response
    res.send(html);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/caravans_managers', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const managersResult = await pool
      .request()
      .query('SELECT * from CaravanManagers');
    const caravansResult = await pool.request().query('SELECT * from Caravans');

    // Build the HTML string dynamically
    let managersHtml = `
        <div style="text-align: center;">
          <h2 style="margin-bottom: 20px;">Available Managers</h2>
          <form method="post" action="/api/add_caravan_manager">
            <select name="name" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
              ${managersResult.recordset
                .map(
                  (manager) =>
                    `<option value="${manager.ManagerID}">${manager.Name}</option>`
                )
                .join('')}
            </select>
            <select name="caravan_id" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
              ${caravansResult.recordset
                .map(
                  (caravan) =>
                    `<option value="${caravan.CaravanID}">${caravan.Name}</option>`
                )
                .join('')}
            </select>
            <input type="submit" value="Add Manager to Caravan" style="padding: 10px; background-color: #4CAF50; color: white; border: none;">
          </form>
        </div>
      `;

    // Send the HTML response
    res.send(managersHtml);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/add_caravan_manager', async (req, res) => {
  try {
    const { name, caravan_id } = req.body;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('name', sql.Int, name)
      .input('caravan_id', sql.Int, caravan_id)
      .query('UPDATE Caravans SET Manager=@name WHERE CaravanID=@caravan_id');

    res.redirect('/api/caravans_managers');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route for getting all guests from the database
app.get('/api/guests', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Guests');
    let html = `
    <!DOCTYPE html>
<html>
<head>
  <title>Guest List</title>
  <script src="guests.js"></script>
  <style>
    h1 {
      text-align: center;
      color: #333;
    }
    form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      color: #666;
    }
    input[type="text"],
    input[type="date"],
    select {
      width: 100%;
      padding: 8px;
      border-radius: 5px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
    button[type="submit"] {
      background-color: #008CBA;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
    button[type="submit"]:hover {
      background-color: #005266;
    }
    #guestList {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    #guestList li {
      background-color: #f9f9f9;
      padding: 10px;
      margin-bottom: 5px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>Guest List</h1>
  <form>
  <label for="GuestID">GuestID:</label>
    <input type="number" id="Guest" name="GuestID" required>
    <label for="firstName">First Name:</label>
    <input type="text" id="firstName" name="firstName" required>
    <br>
    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" name="lastName" required>
    <br>
    <label for="dateOfBirth">Date of Birth:</label>
    <input type="date" id="dateOfBirth" name="dateOfBirth" required>
    <br>
    <label for="gender">Gender:</label>
    <select id="gender" name="gender" required>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
    <br>
    <button type="submit">Add Guest</button>
  </form>
  <ul id="guestList"></ul>
  <script>
  const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/api/guests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const result = await response.json();

    alert(result.message);
  } catch (error) {
    console.error(error);
    alert('Failed to add guest');
  }
});

  </script>
</body>
</html>


    `;
    res.send(html);
    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route for adding a new guest to the database
app.post('/api/guests', async (req, res) => {
  try {
    const { GuestID, firstName, lastName, dateOfBirth, gender } = req.body;

    const pool = await sql.connect(config);
    await pool
      .request()
      .input('GuestID', sql.BigInt(50), GuestID)
      .input('firstName', sql.NVarChar(50), firstName)
      .input('lastName', sql.NVarChar(50), lastName)
      .input('dateOfBirth', sql.Date, dateOfBirth)
      .input('gender', sql.NVarChar(10), gender)
      .query(
        'INSERT INTO Guests (GuestID, FirstName, LastName, DateOfBirth, Gender) VALUES (@GuestID,@firstName, @lastName, @dateOfBirth, @gender)'
      );

    res.json({ message: 'Guest added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { BookingID } = req.params;
    const pool = await sql.connect(config);
    const caravansResult = await pool.request().query('SELECT * from Caravans');
    const result = await pool
      .request()
      .input('BookingID', sql.Int, BookingID)
      .query('SELECT * FROM Bookings WHERE BookingID = @BookingID');

    let html = `
    <div style="text-align: center;">
    <h2 style="margin-bottom: 20px;">Book a Caravan</h2>
    <form method="post" action="/api/book_caravan">
      <label for="caravan_id">Caravan:</label>
      <select name="caravan_id" id="caravan_id" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
        <!-- Populate the dropdown with caravan options -->
        ${caravansResult.recordset
          .map(
            (caravan) =>
              `<option value="${caravan.CaravanID}">${caravan.Name}</option>`
          )
          .join('')}
      </select>
      <label for="BookingID">BookingID:</label>
      <input type="number" name="BookingID" id="BookingID" required style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
      <label for="guest_id">Guest:</label>
      <input type="text" name="guest_id" id="guest_id" required style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
      <label for="start_date">Start Date:</label>
      <input type="date" name="start_date" id="start_date" required style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
      <label for="end_date">End Date:</label>
      <input type="date" name="end_date" id="end_date" required style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; margin-bottom: 20px;">
      <input type="submit" value="Book Caravan" style="padding: 10px; background-color: #4CAF50; color: white; border: none;">
    </form>
  </div>
  
`;

    const booking = result.recordset[0];
    res.send(html);
    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/book_caravan', async (req, res) => {
  try {
    const { BookingID, caravan_id, guest_id, start_date, end_date } = req.body;
    const pool = await sql.connect(config);

    // Insert the new booking into the Bookings table
    await pool
      .request()
      .input('BookingID', sql.Int, BookingID)
      .input('CaravanID', sql.Int, caravan_id)
      .input('GuestID', sql.NVarChar, guest_id)
      .input('StartDate', sql.Date, start_date)
      .input('EndDate', sql.Date, end_date)
      .input('Status', sql.NVarChar, 'Pending')
      .query(
        'INSERT INTO Bookings (BookingID, CaravanID, GuestID, StartDate, EndDate, Status) VALUES (@BookingID,@CaravanID, @GuestID, @StartDate, @EndDate, @Status)'
      );
    res.send('Booking successful!');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
