CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    licence_plate VARCHAR(20) NOT NULL,
    kilometers INTEGER NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    est_maintainance DATE,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    driver_id INTEGER REFERENCES drivers(id),
    in_maintenance BOOLEAN DEFAULT false,
    last_maintainance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO cars (
        licence_plate,
        kilometers,
        address_id,
        est_maintainance,
        last_update,
        driver_id,
        in_maintenance,
        last_maintainance,
        created_at,
        updated_at
    )
VALUES (
        'ABC1234',
        50000,
        5,
        '2024-03-15',
        CURRENT_TIMESTAMP,
        1,
        false,
        '2023-12-15',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'XYZ9876',
        35000,
        6,
        '2024-02-20',
        CURRENT_TIMESTAMP,
        2,
        false,
        '2023-11-30',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'DEF5678',
        62000,
        7,
        '2024-04-01',
        CURRENT_TIMESTAMP,
        NULL,
        true,
        '2024-01-10',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );