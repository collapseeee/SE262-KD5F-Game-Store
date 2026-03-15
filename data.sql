INSERT INTO accounts (username, password, created_date, isSeller) VALUES ('gerry', '123', now(), true);


INSERT INTO categories (name) VALUES ('Dark Fantasy'), ('Atmospheric'), ('RPG');

INSERT INTO products (name,description,price, poster_url)
VALUES
('DARK SOULS™ III', 'Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness!', 59.99, 'https://cdn2.steamgriddb.com/grid/55e39b04fb5ce386d690685f44029957-fakepng.png'),
('DARK SOULS™: REMASTERED', 'Then, there was fire. Re-experience the critically acclaimed, genre-defining game that started it all. Beautifully remastered, return to Lordran in stunning high-definition detail running at 60fps.',  39.99, 'https://cdn2.steamgriddb.com/grid/d68159bcc8608831094ffeac4bb8b5a1-fakepng.png'),
('DARK SOULS™ II: Scholar of the First Sin', 'DARK SOULS™ II: Scholar of the First Sin brings the franchise’s renowned obscurity & gripping gameplay to a new level. Join the dark journey and experience overwhelming enemy encounters, diabolical hazards, and unrelenting challenge.', 39.99, 'https://cdn2.steamgriddb.com/grid/3c55b687e66336ed79466d9d32f14058.png'),
('ELDEN RING', 'THE CRITICALLY ACCLAIMED FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.', 59.99, 'https://cdn2.steamgriddb.com/grid/2ef2c21c3f541cb0126c325ee5d33864-fakepng.png'),
('ELDEN RING NIGHTREIGN', 'ELDEN RING NIGHTREIGN is a standalone adventure within the ELDEN RING universe, crafted to offer players a new gaming experience by reimagining the game’s core design.', 39.99, 'https://cdn2.steamgriddb.com/grid/8a1cef76c3ea963a331d1cebea6ef7d2.jpg'),
('ELDEN RING Shadow of the Erdtree', 'The ELDEN RING Shadow of the Erdtree expansion features an all-new story set in the Land of Shadow imbued with mystery, perilous dungeons, and new enemies, weapons and equipment.', 39.99, 'https://cdn2.steamgriddb.com/grid/73d5e7c59ebbbaf1fef3850dee8c6a1f.png'),
('Bloodborne', 'Hunt your nightmares A lone traveler. A cursed town. A deadly mystery that swallows everything it touches. Face your fears as you enter the decaying city of Yharnam, a forsaken place ravaged by a terrible, all-consuming illness. Scour its darkest shadows, fight for your life with blades and guns and discover secrets that will make your blood run cold – but just might save your skin...', 19.99, 'https://cdn2.steamgriddb.com/grid/99ce11be28659ce5cb0a3ec79a5f06df-fakepng.png'),
('Sekiro™: Shadows Die Twice - GOTY Edition', 'Game of the Year - The Game Awards 2019 Best Action Game of 2019 - IGN Carve your own clever path to vengeance in the award winning adventure from developer FromSoftware, creators of Bloodborne and the Dark Souls series. Take Revenge. Restore Your Honor. Kill Ingeniously.', 59.99, 'https://cdn2.steamgriddb.com/grid/500f4c19df482dc68975711067cb48af-fakepng.png');
INSERT INTO product_lists (product_id, category_id, user_id, release_date) VALUES (1,1,1, now()), (2,2,1, now()), (3,3,1, now()), (1,2,1, now()), (4,1,1, now()), (5,2,1,now()), (6,1,1,now()), (6,3,1,now()), (7,1,1, now()), (8,3,1,now());

