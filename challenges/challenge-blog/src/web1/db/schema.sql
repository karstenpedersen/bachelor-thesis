CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, content) VALUES 
('Første post', 'Velkommen til bloggen!'),
('Anden post', 'Dette er en testartikel.'),
('Tredje post', 'Denne er for at fejre udgivelsen af Minecraft filmen');
