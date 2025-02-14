CREATE TABLE IF NOT EXISTS mechanics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO mechanics (
        name,
        phone_number,
        address_id,
        created_at,
        updated_at
    )
VALUES (
        'Bob Mechanic',
        '5493743515495',
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Alice Mechanic',
        '5493743515495',
        2,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );