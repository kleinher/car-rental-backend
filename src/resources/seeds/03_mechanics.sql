INSERT INTO mechanics (
        name,
        address,
        phoneNumber,
        latitude,
        longitude,
        createdAt,
        updatedAt
    )
VALUES (
        'Bob Mechanic',
        '789 Repair St',
        '+11122233344',
        -27.5890,
        -48.5456,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Alice Mechanic',
        '321 Fix Ave',
        '+14445556677',
        -27.5932,
        -48.5423,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );