CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    is_creator BOOLEAN DEFAULT false
);

CREATE TABLE token (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL,
    user_os VARCHAR(100),
    user_device VARCHAR(100),
    user_browser VARCHAR(100),
    hashed_refresh_token VARCHAR(255) NOT NULL
);

CREATE TABLE otp (
    id UUID PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    expiration_time TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT false
);


CREATE TABLE queue (
    id SERIAL PRIMARY KEY,
    spec_service_id INTEGER,
    client_id INTEGER,
    queue_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    queue_number INTEGER NOT NULL
);

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE spec_service (
    id SERIAL PRIMARY KEY,
    spec_id INTEGER,
    service_id INTEGER,
    spec_service_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE spec_social (
    id SERIAL PRIMARY KEY,
    spec_id INTEGER,
    social_id INTEGER,
    link VARCHAR(255)
);

CREATE TABLE social (
    id SERIAL PRIMARY KEY,
    social_name VARCHAR(100) NOT NULL,
    social_icon_file VARCHAR(255)
);

CREATE TABLE spec_working_day (
    id SERIAL PRIMARY KEY,
    spec_id INTEGER,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    finish_time TIME NOT NULL,
    rest_start_time TIME,
    rest_finish_time TIME
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    phone_number VARCHAR(15),
    info VARCHAR(100),
    photo VARCHAR(100),
    is_active BOOLEAN DEFAULT false,
    otp_id UUID
);

CREATE TABLE specialists (
    id SERIAL PRIMARY KEY,
    position VARCHAR,
    last_name VARCHAR,
    first_name VARCHAR NOT NULL,
    middle_name VARCHAR,
    birth_day DATE,
    photo VARCHAR,
    phone_number VARCHAR,
    info VARCHAR,
    is_active BOOLEAN DEFAULT false,
    show_position BOOLEAN DEFAULT false,
    show_last_name BOOLEAN DEFAULT false,
    show_first_name BOOLEAN DEFAULT false,
    show_middle_name BOOLEAN DEFAULT false,
    show_photo BOOLEAN DEFAULT false,
    show_social BOOLEAN DEFAULT false,
    show_info BOOLEAN DEFAULT false,
    show_birth_day BOOLEAN DEFAULT false,
    show_phone_number BOOLEAN DEFAULT false,
    otp_id UUID
);

ALTER TABLE token
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES admin(id);

ALTER TABLE clients
ADD CONSTRAINT fk_client_otp FOREIGN KEY (otp_id) REFERENCES otp(id);

ALTER TABLE specialists 
ADD CONSTRAINT fk_specialist_otp FOREIGN KEY (otp_id) REFERENCES otp(id);

ALTER TABLE queue
ADD CONSTRAINT fk_queue_spec_service FOREIGN KEY (spec_service_id) REFERENCES spec_service(id),
ADD CONSTRAINT fk_queue_client FOREIGN KEY (client_id) REFERENCES clients(id);

ALTER TABLE spec_service
ADD CONSTRAINT fk_spec_service_specialist FOREIGN KEY (spec_id) REFERENCES specialists(id),
ADD CONSTRAINT fk_spec_service_service FOREIGN KEY (service_id) REFERENCES service(id);

ALTER TABLE spec_social
ADD CONSTRAINT fk_spec_social_specialist FOREIGN KEY (spec_id) REFERENCES specialists(id),
ADD CONSTRAINT fk_spec_social_social FOREIGN KEY (social_id) REFERENCES social(id);

ALTER TABLE spec_working_day
ADD CONSTRAINT fk_working_day_specialist FOREIGN KEY (spec_id) REFERENCES specialists(id);
