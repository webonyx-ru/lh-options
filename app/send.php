<?php

header('Content-Type: application/json; charset=UTF-8;');

##################################################################################

$toEmails = 'desk@lh-broker.com'; // recipient email address
$subject  = 'Options. Aренда трейдера'; // subject line for emails
$EOL      = "\r\n";
$HR       = "\r\n------------\r\n";

##################################################################################

$errors = array();

//check if its an ajax request, exit if not
if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) || 'xmlhttprequest' != strtolower($_SERVER['HTTP_X_REQUESTED_WITH']))
{
    $errors[] = array('', 'Request must come from Ajax');
}
else if(!empty($_REQUEST['userEmail']) && false === filter_var($_REQUEST['userEmail'], FILTER_VALIDATE_EMAIL))
{
    $errors[] = array('userEmail', 'Email is incorrect');
}
else if (empty($_REQUEST['userName']) && empty($_REQUEST['userEmail']) && empty($_REQUEST['userPhone']))
{
    $errors[] = array('userEmail', 'Field is empty');
}

##################################################################################

if (empty($errors))
{
    $userEmail = $_REQUEST['userEmail'];

    $message  = 'User: ' . $_REQUEST['userName'] . $HR .
                'E-mail: ' . $userEmail . $HR .
                'Phone: ' . $_REQUEST['userPhone'] . $EOL;

    $headers = 'From: ' . ' Binary Options Landing ' . $EOL .
               'Reply-To: ' . $userEmail . $EOL .
               'X-Mailer: PHP/' . phpversion() . $EOL .
               'Mime-Version: 1.0' . $EOL .
               'Content-type: text/plain; charset=UTF-8' . $EOL;

    foreach (explode(';', $toEmails) as $toEmail)
    {
        if (!mail($toEmail, $subject, $message, $headers))
        {
            $errors[] = array('userEmail', 'Field is empty');
        }
    }
}

##################################################################################

if (empty($errors))
{
    $result = array('success' => true);
}
else
{
    $result = array('success' => false, 'errors' => $errors);
}

##################################################################################

echo json_encode(array('response' => $result));