CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO drivers (
        name,
        phone_number,
        address_id,
        created_at,
        updated_at
    )
VALUES (
        'John Driver',
        '5493743515495',
        3,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Jane Driver',
        '5493743515495',
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );