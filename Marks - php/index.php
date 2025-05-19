<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VIT Semester Result</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body >

<div class="container ">
  <h2 class="text-center mb-4">VIT Semester Result</h2>

  <form method="post" class="row justify-content-center">
    <div >
      <input type="number" name="prn" class="form-control" placeholder="Enter PRN" required>
    </div>
    <div>
      <button type="submit" name="load" class="btn btn-primary">Show Result</button>
    </div>
  </form>

  <div >
    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['load'])) {
        $prn = intval($_POST['prn']);

        // Database connection
        $conn = new mysqli("localhost", "root", "", "vit_results"); // Change credentials if needed
        if ($conn->connect_error) {
            die("<pre>Connection failed: " . $conn->connect_error . "</pre>");
        }

        $stmt = $conn->prepare("
            SELECT s.name,
                   ROUND(m.OS * 0.3 + e.OS * 0.7, 2) AS OS,
                   ROUND(m.CN * 0.3 + e.CN * 0.7, 2) AS CN,
                   ROUND(m.CS * 0.3 + e.CS * 0.7, 2) AS CS,
                   ROUND(m.CD * 0.3 + e.CD * 0.7, 2) AS CD
            FROM Students s
            JOIN MSE m ON s.prn = m.prn
            JOIN ESE e ON s.prn = e.prn
            WHERE s.prn = ?
        ");
        $stmt->bind_param("i", $prn);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            echo "<pre>";
            echo "Marks of " . htmlspecialchars($row['name']) . "\n\n";
            echo "OS: " . $row['OS'] . "\n";
            echo "CN: " . $row['CN'] . "\n";
            echo "CS: " . $row['CS'] . "\n";
            echo "CD: " . $row['CD'] . "\n";
            echo "</pre>";
        } else {
            echo "<pre>No record found for PRN: $prn</pre>";
        }

        $stmt->close();
        $conn->close();
    }
    ?>
  </div>
</div>

</body>
</html>
