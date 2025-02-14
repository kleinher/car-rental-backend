CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    formatted_address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO addresses (formatted_address, latitude, longitude)
VALUES ('123 Main St, City A', -27.5969, -48.5495),
    ('456 Oak Ave, City B', -27.6012, -48.5377),
    ('789 Pine Rd, City C', -27.5890, -48.5456),
    ('789 Pine Rd, City C', -27.5890, -48.5456),
    ('789 Pine Rd, City C', -27.5890, -48.5456),
    ('789 Pine Rd, City C', -27.5890, -48.5456),
    ('321 Elm St, City D', -27.5932, -48.5423);