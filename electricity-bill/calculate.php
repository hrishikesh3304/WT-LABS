<?php
include 'database.php';

// Get form values
$id = $_POST['id'];
$submitType = $_POST['submit'];
$units = $_POST['units']; // Default to 0 if not set


echo "{$submitType}";
// Function to calculate bill
function calculateBill($units) {
    if ($units <= 50) {
        return $units * 3.5;
    } elseif ($units <= 150) {
        return (50 * 3.5) + (($units - 50) * 4.0);
    } elseif ($units <= 250) {
        return (50 * 3.5) + (100 * 4.0) + (($units - 150) * 5.2);
    } else {
        return (50 * 3.5) + (100 * 4.0) + (100 * 5.2) + (($units - 250) * 6.5);
    }
}

// If "Add Bill" was clicked
if ($submitType == "calculate" ) {
    $bill = calculateBill($units);

    $query = "INSERT INTO bills (id, bill) VALUES ('$id', '$bill')";
    if (mysqli_query($conn, $query)) {
        echo "<pre>Bill of ₹{$bill} added for Customer ID: {$id}\n</pre>";
    } else {
        echo "<pre>Error adding bill: " . mysqli_error($conn) . "</pre>";
    }
}


$query = "SELECT name 
            FROM consumers
            WHERE id = '$id'
";
$result = mysqli_query($conn, $query);
$row = mysqli_fetch_assoc($result);


echo "<h3>Bills for {$row['name']}</h3>";

// View all bills for the customer
$query = "SELECT bills.transaction_id, consumers.name, bills.date, bills.bill 
          FROM bills 
          JOIN consumers ON bills.id = consumers.id 
          WHERE consumers.id = '$id'
          ORDER BY bills.date DESC";

$result = mysqli_query($conn, $query);

// Display 


echo "<pre>";

while ($row = mysqli_fetch_assoc($result)) {
    echo "Transaction ID: {$row['transaction_id']}\n";
    echo "Date: {$row['date']}\n";
    echo "Bill: Rs{$row['bill']}\n";
    echo "-------------------------\n";
}

echo "</pre>";

// Close connection
mysqli_close($conn);
?>
