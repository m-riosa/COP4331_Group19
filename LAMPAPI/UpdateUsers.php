<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];
    $id = $inData["id"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $ret = $conn->prepare("SELECT FirstName FROM Users WHERE ID=?");
        $ret->bind_param("s", $id);
        $ret->execute();
        $ret->store_result();

        if( $ret->num_rows > 0){
            $stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Login=?, Password=? WHERE ID=?");
    		$stmt->bind_param("sssss", $firstName, $lastName, $login, $password, $id);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            returnWithError("");
        }
        else{
            $ret->close();
			$conn->close();
			returnWithError("No User found with this ID");
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

    function returnWithInfo( $firstName, $lastName, $login, $password, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":"' . $login . '","password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithError( $err )
	{
        $retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}


?>
