// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const session = require('express-session');
const sessionStore = require('./models/session');
const { getAllProduct, searchProduct, addProduct, addGallery, addVideo, addSystemRequirements, getProductById, addProductList, getRequirementsByProductId, getImagesByProductId, getVideosByProductId, deleteGalleryByImageId,getCategoriesByProductId } = require('./models/product');
const { getAllCategory } = require('./models/category');
const { getImageByGameProductId } = require('./models/image');
const multer = require('multer');
const Account = require('./models/account');
const upload = multer({ dest: 'public/assets/picture' });
const app = express();
// App setup
app.use(
    session({
        secret: 'my-secret-key',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60   // 1 hour
        }
    })
);

app.use(express.static('public'));

app.use(express.json());

app.use(express.static('node_modules/bootstrap'));
app.use(express.static('node_modules/bootstrap-icons'));
app.use(express.static('node_modules/bootstrap-multiselect'));
app.use(express.static('node_modules/jquery'));
app.use(express.static('public/assets/'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');


// Webpage endpoints

app.get('/', async (req, res) => {
    console.log('Session before rendering:', req.session);
    const games = await getAllProduct();
    const categories = await getAllCategory();
    console.log(games, "\n\n\nThis print log is at line 48 of server.js");
    if (req.session.username) {
        res.render('index', {

            username: req.session.username,
            role: req.session.role
        });
    } else {
        console.log('No user logged in, rendering identification page.');
        // Want to see ejs page change? edit here
        res.render('index', {
            categories: categories,
            games: games
        });
    }
});


app.post('/loginBuyer', (req, res) => {
    const { username, password, role } = req.body;
    Auth.loginBuyer(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;
            console.log('Session after login:', req.session);
            return res.redirect('/');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during login');
        });

});

app.post('/loginSeller', (req, res) => {
    const { username, password, role } = req.body;
    Auth.loginSeller(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;

            res.redirect('/');
            console.log('Session after login:', req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during login');
        });

});

app.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
    Auth.signup(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;

            res.redirect('/');
            console.log('Session after signup:', req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during signup');
        });

});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error during logout');
        } else {
            res.send('Logout successful');
            res.redirect('/');
        }



    });
});
app.get('/login', (req, res) => {
    res.render('identification', {
        // Data here
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/sellerInformation', async (req, res) => {
    try {
        // สมมติว่า getUserById เป็นฟังก์ชันที่ดึงข้อมูลจาก DB
        const rows = await Account.getUserById("1");
        const sellerData = (rows && rows.length > 0) ? rows[0] : null;

        res.render('seller/personalInformation', {seller: sellerData});
        console.log('Seller data fetched for personal information page:', sellerData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching seller info");
    }
});
app.get('/account', (req, res) => {
    res.render('buyer/personalInformation', {
        // Data here
        categories: categories
    });
});

// SEARCH PRODUCTS
app.get('/result', async (req, res) => {
    const { gameName, categories, category } = req.query;
    let filteredIds = '';

    if (category) {
        filteredIds += category;
    }
    // If the category is selected
    if (categories) {
        const [filterCategory] = Array.isArray(categories) ? [categories] : categories;
        // If multiple categories selected
        if (categories.length > 1) {
            filterCategory.forEach(categoryId => {
                filteredIds += categoryId + ',';
            });
            // Remove the last comma sign
            filteredIds = filteredIds.substring(0, filteredIds.length - 1);
        }
        if (categories.length === 1) {
            filteredIds = categories;
        }
    }
    const results = await searchProduct(gameName, filteredIds);

    res.render('buyer/searchResult', {
        games: results
    });
});

app.get('/productdetail', (req, res) => {
    res.render('buyer/productDetail', {
        categories: categories
    });
});
app.get('/cart', (req, res) => {
    // Mock data, Get data FROM Cart table WHERE userid = ...
    const games = [{
        name: "HELLDIVER 9",
        categories: ['Action', 'Shooter'],
        price: 999.99,
        added_date: Date.now()
    }, {
        name: "Mangophobia",
        categories: ['Horror'],
        price: 0.99,
        added_date: Date.now()
    }];

    res.render('buyer/shoppingCart', {
        // Data here (Currently mock data)
        games: games,
        categories: categories
    });
});
app.get('/checkout', (req, res) => {
    res.render('checkout', {
        // Data here
    });
});
app.get('/wishlist', (req, res) => {

    // Get product where user.id = wishlist.user_id DISTINCT product_id
    const games = [{
        name: "HELLDIVER 2",
        categories: ['Action', 'Shooter'],
        price: 999.99,
        wishlisted_date: Date.now()
    }, {
        name: "Phasmophobia",
        categories: ['Horror'],
        price: 0.99,
        wishlisted_date: Date.now()
    }];

    res.render('buyer/wishlist', {
        // Data here
        categories: categories,
        games: games
    });
});
app.get('/contact', (req, res) => {

    res.render('contact', {
        // Data here
        categories: ['All Category', 'FPS', 'Soul-Like', 'Family']
    });
});

// API endpoints

app.get('/api/product', async (req, res) => {
    // GET all products
});
// dashboard page for seller
app.get('/dashboard', async (req, res) => {
    try {
        const games = await getAllProduct();
        const categories = await getAllCategory();
        console.log(games, "\n\n\nThis print log is at line 48 of server.js");
        res.render('seller/dashboard', {
            // Data here
            categories: categories,
            games: games
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching dashboard data");
    }
});
app.get('/api/product/add', (req, res) => {
    res.render('seller/product',{
        mode: 'add',
        product: {},
        min: {},
        rec: {},
        gallery: [],
        videos: [],
        currentCategories: []
    });
});
app.get('/api/product/edit/:id', async (req, res) => {
    try {
    const productId = req.params.id;
    // ดึงข้อมูล Product และ Requirements จาก DB
    const product = await getProductById(productId);
    const categories = await getCategoriesByProductId(productId);
    const requirements = await getRequirementsByProductId(productId);
    const images = await getImagesByProductId(productId);
    const videos = await getVideosByProductId(productId);
    if (!product[0]) return res.status(404).send("Product not found");
        console.log("Fetched product for edit:", product[0]);
        res.render('seller/product', {
            mode: 'edit',
            product: product[0],
            min: requirements.min,
            rec: requirements.rec,
            gallery: images,
            videos: videos, // จะเป็น [url1, url2]
            currentCategories: categories
        });
    }
        catch (err) {
        console.error("Error in Edit Route:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/api/categories', async (req, res) => {
    const categories = await getAllCategory();;
    res.json(categories);
});
app.post('/api/product/add', upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'gallery_image[]', maxCount: 4 }
]),
async(req, res) =>
{
    try {
    let categories = req.body['category[]'] || req.body.category; // รองรับทั้งกรณีที่ส่งมาเป็น array หรือ string เดียว
    const posterFile = req.files['poster'] ? req.files['poster'][0] : null;
    const galleryFiles = req.files['gallery_image[]'] || [];
    const videoUrls = [req.body.videoUrl, req.body.videoUrl2].filter(url => url && url.trim() !== "");
        const { name, category, price, description } = req.body;
        const productId = await addProduct(name, description, price, posterFile.path);
        if (!Array.isArray(categories)) {
            categories = [categories];
        }
        if (productId) {
            for (const categoryId of categories) {
                await addProductList(productId, categoryId, 1);
                console.log(`Linked product ${productId} with category ${categoryId}`);
            }
        // 2. วนลูปบันทึก Gallery (ถูกต้องแล้ว)
        for (const file of galleryFiles) {
            await addGallery(file.path, productId);
        }

        // 3. วนลูปบันทึก Video (ใช้ชื่อตัวแปรที่รวมมาแล้ว)
        for (const video of videoUrls) {
            await addVideo(video, productId);
        }

        // ส่วนของ System Requirements...
        await addSystemRequirements(productId, req.body);
        
        res.status(200).send("เพิ่มข้อมูลสำเร็จ");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error adding product');
    }
});

app.delete('/categories/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    // ลบโดยการกรองเอาตัวที่ไม่ใช่ ID ที่ส่งมาเก็บไว้แทน
    categories = categories.filter(cat => cat.id !== targetId);
    res.json({ success: true });
    console.log(`Deleted category with ID: ${targetId}`);
});
app.delete('/api/gallery/delete/:id', async (req, res) => {
    const imageId = parseInt(req.params.id);
    try {
        const result = await deleteGalleryByImageId(imageId);
        res.json({ success: true });
        console.log(`Deleted gallery image with ID: ${imageId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting gallery image');
    }
});
app.put('/categories/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    const newName = req.body.name;
    const category = categories.find(cat => cat.id === targetId);
    if (category) {
        category.name = newName;
        res.json({ success: true });
        console.log(`Updated category with ID: ${targetId} to new name: ${category.name}`);
    } else {
        res.status(404).json({ success: false, message: 'Category not found' });
    }
});


app.delete('/api/games/:id', async(req, res) => {
    const targetId = parseInt(req.params.id);
    games = games.filter(game => game.id !== targetId);
    res.json({ success: true });
    console.log(`Deleted game with ID: ${targetId}`);
    try {
        const data = await getAllProduct();
        res.json(data);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.get('/api/image/:id', async (req, res) => {
    try {
        const data = await getImageByGameProductId(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.listen(3000, () => {
    console.log('The server is listening at port 3000.');
});