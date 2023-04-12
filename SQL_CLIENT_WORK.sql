create database PleinAir_Booking;
use PleinAir_Booking;


CREATE TABLE Caravans (
CaravanID INT PRIMARY KEY,
Name VARCHAR(50) NOT NULL,
Description VARCHAR(255),
Type VARCHAR(20),
Manager VARCHAR(50),
AccommodationCount INT,
AdditionalExtension BIT
);

CREATE TABLE Guests (
GuestID INT PRIMARY KEY,
FirstName VARCHAR(50) NOT NULL,
LastName VARCHAR(50) NOT NULL,
DateOfBirth DATE,
Gender VARCHAR(10)
);

CREATE TABLE Bookings (
BookingID INT PRIMARY KEY,
CaravanID INT,
GuestID INT,
StartDate DATE,
EndDate DATE,
Status VARCHAR(20),
FOREIGN KEY (CaravanID) REFERENCES Caravans(CaravanID),
FOREIGN KEY (GuestID) REFERENCES Guests(GuestID)
);


CREATE TABLE CaravanTypes (
TypeID INT PRIMARY KEY,
Type VARCHAR(20) NOT NULL
);

CREATE TABLE CaravanManagers (
ManagerID INT PRIMARY KEY,
Name VARCHAR(50) NOT NULL
);

INSERT INTO CaravanTypes (TypeID, Type)
VALUES
(1, 'Beachfront'),
(2, 'Desert View'),
(3, 'Family Accommodation'),
(4, 'Luxury'),
(5, 'Economy');

INSERT INTO CaravanManagers (ManagerID, Name)
VALUES
(1, 'John Doe'),
(2, 'Jane Smith'),
(3, 'Ahmed Ali');

INSERT INTO Caravans (CaravanID, Name, Description, Type, Manager, AccommodationCount, AdditionalExtension)
VALUES
(1, 'Caravan A', 'Luxury beachfront caravan with ocean view', 'Beachfront', 'John Doe', 4,1),
(2, 'Caravan B', 'Family-friendly caravan with a desert view', 'Desert View', 'Jane Smith', 6,0),
(3, 'Caravan C', 'Basic caravan with no frills', 'Economy', 'Ahmed Ali', 2,1);

INSERT INTO Guests (GuestID, FirstName, LastName, DateOfBirth, Gender)
VALUES
(1, 'John', 'Doe', '1990-05-12', 'Male'),
(2, 'Jane', 'Smith', '1985-07-24', 'Female'),
(3, 'Ahmed', 'Ali', '2000-01-01', 'Male');

INSERT INTO Bookings (BookingID, CaravanID, GuestID, StartDate, EndDate, Status)
VALUES
(1, 1, 1, '2023-04-01', '2023-04-05', 'Confirmed'),
(2, 2, 2, '2023-05-01', '2023-05-10', 'Pending'),
(3, 3, 3, '2023-06-01', '2023-06-08', 'Cancelled');

SELECT * FROM Caravans;
SELECT * FROM Guests;
SELECT * FROM Bookings;
SELECT * FROM CaravanTypes;
SELECT * FROM CaravanManagers;

UPDATE Caravans
SET Name = 'New Caravan Name', Type = 'Beach Front'
WHERE CaravanID = 1;

UPDATE Guests
SET FirstName = 'John', LastName = 'Doe'
WHERE GuestID = 3;

UPDATE Bookings
SET StartDate = '2023-04-01', EndDate = '2023-04-08'
WHERE BookingID = 2;

DELETE FROM Caravans
WHERE CaravanID = 5;

DELETE FROM Guests
WHERE GuestID = 4;

DELETE FROM Bookings
WHERE BookingID = 3;

SELECT * FROM Caravans;

SELECT CaravanID, Name, Type FROM Caravans;

SELECT FirstName, LastName, DateOfBirth FROM Guests WHERE Gender = 'Male';

SELECT b.BookingID, c.Name, g.FirstName, g.LastName, b.StartDate, b.EndDate, b.Status 
FROM Bookings b 
JOIN Caravans c ON b.CaravanID = c.CaravanID 
JOIN Guests g ON b.GuestID = g.GuestID;














