const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 5000;
app.use(cors());


const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/recipe_site_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

app.use(cors());
app.use(express.json());

// Создание модели для рецепта
const recipeSchema = new mongoose.Schema({
    title: String,
    image: String,
    ingredients: [String],
    instructions: String,
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: { type: Array, default: [] },
    avatar: {
        type: Buffer,
        contentType: String,
    },
});


const User = mongoose.model('User', UserSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = User;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token Verification Error:', err.message);
            return res.status(403).json({ message: 'Invalid Token' });
        }

        console.log('Decoded User from Token:', user);
        req.user = user;
        next();
    });
};

// Конфигурация для сохранения файлов в папку 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName); // Сохраняем файл с уникальным именем
    }
});

const upload = multer({ storage });

// Получение всех рецептов
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получение рецепта по ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Маршрут для поиска рецептов по названию
app.get('/recipes_search', async (req, res) => {
    try {
        const { query } = req.query;
        console.log('Received query:', query);

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        // Выполняем поиск рецептов, название которых содержит подстроку query (регистронезависимый поиск)
        const recipes = await Recipe.find({
            title: { $regex: query, $options: 'i' }
        });

        if (recipes.length === 0) {
            return res.status(404).json({ message: `No recipes found, ${query}` });
        }

        res.json({ results: recipes }); // Возвращаем рецепты
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});

app.get('/recipes_cuisine/:type', async (req, res) => {
    const { type } = req.params;  // Получаем параметр из URL

    try {
        const recipes = await Recipe.find({
            cuisine: { $regex: String(type), $options: 'i' }
        });

        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found for this cuisine' });
        }

        res.json({ results: recipes });
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});

app.get("/random_recipes", async (req, res) => {
    try {
        const numberOfRecipes = parseInt(req.query.number) || 3;  // Читаем параметр 'number' из запроса
        const recipes = await Recipe.aggregate([{ $sample: { size: numberOfRecipes } }]);  // Получаем случайные рецепты
        res.json({ recipes });
    } catch (error) {
        console.error("Ошибка на сервере:", error);
        res.status(500).json({ message: "Ошибка при получении случайных рецептов", error: error.message });

    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
            message: 'Login successful',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// Маршрут для добавления нового пользователя
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Проверка, существует ли пользователь
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Сохранение пользователя в базе данных
        await newUser.save()
            .then((savedUser) => {
                console.log('Saved user:', savedUser);
                res.status(201).json({ message: 'User saved successfully' });
            })
            .catch((err) => {
                console.error('Error saving user:', err);
                res.status(500).json({ message: 'Server error' });
            });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Показать рецепты пользователя
app.get('/users/favorites', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];  // Извлекаем токен из заголовка
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Проверка токена
        const user = await User.findById(decoded.id);  // Получаем пользователя по ID из токена

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favorites = await Recipe.find({ _id: { $in: user.favorites } });  // Получаем рецепты из избранного
        res.status(200).json(favorites);  // Отправляем данные о фаворитах
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch favorites' });
    }
});

// Добавить рецепт в избранное
app.post('/favorites/:id', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'Invalid User ID in Token' });
        }
        console.log('Request from user ID:', req.user.id);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recipeId = req.params.id;
        console.log('Recipe id:', recipeId);

        // Проверка, что рецепт уже есть в избранном
        if (user.favorites.includes(recipeId)) {
            return res.status(200).json({ message: 'Recipe already in favorites', favorites: user.favorites });
        }

        // Если рецепт еще не в избранном, добавляем его
        user.favorites.push(recipeId);
        await user.save();
        return res.status(200).json({ message: 'Recipe added to favorites', favorites: user.favorites });
    } catch (err) {
        console.error('Error while adding to favorites:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.get('/users/:id/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('favorites');
        res.status(200).json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: "Error fetching favorites", error: err.message });
    }
});


// Удалить рецепт из избранного
app.delete('/favorites/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            console.error('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        const recipeId = req.params.id;

        // Проверяем и инициализируем favorites
        if (!user.favorites) {
            user.favorites = [];
        }

        if (user.favorites.includes(recipeId)) {
            user.favorites = user.favorites.filter(id => id !== recipeId);
            await user.save();
            return res.status(200).json({ message: "Recipe removed from favorites", favorites: user.favorites });
        }

        return res.status(400).json({ message: "Recipe not found in favorites" });
    } catch (err) {
        console.error('Error while removing from favorites:', err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Проверка, добавлен ли рецепт в избранное
app.get('/favorites/check/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);  // Ищем пользователя по ID из токена
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favorites.includes(req.params.id);  // Проверяем, есть ли рецепт в избранном
        res.status(200).json({ isFavorite });  // Возвращаем информацию о статусе
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Маршрут для обновления профиля пользователя
app.put('/users/update', authenticateToken, async (req, res) => {
    try {
        const { username, email, avatar } = req.body;
        const userId = req.user.id;

        if (!username || !email) {
            return res.status(400).json({ message: 'Username and Email are required' });
        }

        // Проверка на уникальность email
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, avatar },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Разрешаем парсить бинарные данные
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

app.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Логируем информацию о файле
        console.log(file);

        // Путь для доступа к файлу (для использования в URL)
        const avatarUrl = `http://localhost:5000/uploads/${file.filename}`;

        // Обновление аватара пользователя в базе данных
        const user = await User.findById(req.user.id);
        user.avatar = avatarUrl;
        await user.save();

        // Отправляем URL изображения в ответ
        res.json({ url: avatarUrl });
    } catch (err) {
        console.error('Error uploading avatar:', err);
        res.status(500).json({ message: 'Error uploading avatar' });
    }
});


//updateUsers();

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

