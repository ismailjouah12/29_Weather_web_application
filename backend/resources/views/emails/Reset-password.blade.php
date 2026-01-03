<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <h2>Password Reset Request</h2>
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="{{ $resetUrl }}">Reset Password</a></p>
    <p>This link will expire in 60 minutes.</p>
    <p>If you did not request this reset, please ignore this email.</p>
</body>
</html>