INSERT INTO drivers (
        name,
        phoneNumber,
        AddressId,
        createdAt,
        updatedAt
    )
VALUES (
        'John Driver',
        '+1234567890',
        3,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Jane Driver',
        '+1987654321',
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );