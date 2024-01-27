<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $id = $inData["id"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$ret = $conn->prepare("SELECT FirstName FROM Contacts WHERE ID=?");
	        $ret->bind_param("s", $id);
	        $ret->execute();
	        $ret->store_result();

		if( $ret->num_rows > 0){
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE id=?");
			$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $id);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}
		else{
			$ret->close();
			$conn->close();
			returnWithError("No Contact found with this ID");
		}
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
