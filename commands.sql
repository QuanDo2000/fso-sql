CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('John Doe', 'http://www.johndoe.com', 'John Doe''s Blog');
INSERT INTO blogs (author, url, title) VALUES ('Jane Doe', 'http://www.janedoe.com', 'Jane Doe''s Blog');
