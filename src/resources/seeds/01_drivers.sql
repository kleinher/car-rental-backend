INSERT INTO drivers (
        name,
        phoneNumber,
        address,
        latitude,
        longitude,
        createdAt,
        updatedAt
    )
VALUES (
        'John Driver',
        '+1234567890',
        '123 Driver St',
        -27.5969,
        -48.5495,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Jane Driver',
        '+1987654321',
        '456 Driver Ave',
        -27.6012,
        -48.5377,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );