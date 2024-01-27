<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$checkStmt = $conn->prepare("SELECT firstName FROM Contacts WHERE firstName = ? AND lastName = ? AND userId = ? ");
		$checkStmt->bind_param("sss", $firstName, $lastName, $userId);
		$checkStmt->execute();
		$checkStmt->store_result();

		if( $checkStmt->num_rows == 0 )
		{
			$checkStmt->close();
			$conn->close();
			returnWithError("No Contact found with this information");
			return;
		}
		$stmt = $conn->prepare("DELETE from Contacts where FirstName = ? AND LastName = ? AND UserID = ?");
		$stmt->bind_param("sss", $firstName, $lastName, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
		
	}

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}


?>
