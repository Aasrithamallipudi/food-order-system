package com.foodorder.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.foodorder.backend.model.FoodItem;
import com.foodorder.backend.model.Restaurant;
import com.foodorder.backend.model.Role;
import com.foodorder.backend.model.User;
import com.foodorder.backend.repository.FoodItemRepository;
import com.foodorder.backend.repository.RestaurantRepository;
import com.foodorder.backend.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RestaurantRepository restaurantRepository, FoodItemRepository foodItemRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.restaurantRepository = restaurantRepository;
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed data if tables are empty (preserve user data)
        if (userRepository.count() == 0) {
            seedDefaultUser();
        }
        if (restaurantRepository.count() == 0) {
            seedRestaurants();
        }
    }

    private void seedDefaultUser() {
        User defaultUser = new User();
        defaultUser.setFullName("Test User");
        defaultUser.setEmail("test@example.com");
        defaultUser.setPassword(passwordEncoder.encode("password123"));
        defaultUser.setRole(Role.ROLE_USER);
        userRepository.save(defaultUser);
    }

    private void seedRestaurants() {
        // Restaurant 1: North Indian
        Restaurant r1 = new Restaurant();
        r1.setName(" Spice Garden");
        r1.setCuisine("North Indian");
        r1.setImageUrl("https://media.istockphoto.com/id/873539518/photo/deep-fried-bread-spicy-chickpeas-curry-and-salad.jpg?s=2048x2048&w=is&k=20&c=oXjCteoVh8WU4dQ8ucWRWcO06FG5Ndqut9VkM_FsNrQ=");
        r1.setRating(4.6);
        restaurantRepository.save(r1);

        saveFood(r1, "Paneer Butter Masala", "Paneer (250g), Butter (50g), Tomato puree (150ml), Cream (100ml), Cashew paste (2 tbsp)", 219.0,
                "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=80");
        saveFood(r1, "Chole Bhature", "Chickpeas (200g), Flour (300g), Oil (100ml), Spices (1 tsp), Lemon (1)", 149.0,
                "https://media.istockphoto.com/id/1209871093/photo/choley-bhature.jpg?s=2048x2048&w=is&k=20&c=Va-XQC_tuUn2v9ns4EodHvk2CXXm6hnHDvzGUvUbwg8=");
        saveFood(r1, "Butter Naan", "Flour (200g), Butter (30g), Yogurt (50ml), Yeast (1 tsp), Salt (1 tsp)", 49.0,
                "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&auto=format&fit=crop&q=80");
        saveFood(r1, "Dal Makhani", "Black lentils (150g), Kidney beans (50g), Butter (60g), Cream (80ml), Ginger-garlic paste (2 tbsp)", 189.0,
                "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&auto=format&fit=crop&q=80");
        saveFood(r1, "Tandoori Chicken", "Chicken (300g), Yogurt (100ml), Tandoori masala (2 tbsp), Lemon (1), Ginger-garlic paste (1 tbsp)", 299.0,
                "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop&q=80");
        saveFood(r1, "Biryani", "Basmati rice (200g), Chicken (250g), Yogurt (100ml), Onions (2), Biryani masala (2 tbsp)", 249.0,
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80");
        saveFood(r1, "Paneer Tikka", "Paneer (200g), Yogurt (80ml), Tandoori masala (1.5 tbsp), Capsicum (1), Onion (1)", 259.0,
                "https://media.istockphoto.com/id/1085155394/photo/malai-or-achari-paneer-in-a-gravy-made-using-red-gravy-and-green-capsicum-served-in-a-bowl.jpg?s=2048x2048&w=is&k=20&c=sUvyKXWH9aGIGDnGnlztdPePvj6WYQ4HZIsb10Ynn8I=");
        saveFood(r1, "Raita", "Yogurt (200ml), Cucumber (1), Mint leaves (10), Cumin powder (1 tsp), Salt (0.5 tsp)", 89.0,
                "https://media.istockphoto.com/id/1413985011/photo/pomegranate-and-cucumber-raita-indian-fresh-sauce-or-condiment-called-raita-yogurt-mixed-with.jpg?s=2048x2048&w=is&k=20&c=6-GbHHqz1-b_V2LKSCFGhK7KZzLWOzF-XRkH_sz_-sU=");
        saveFood(r1, "Lassi", "Yogurt (300ml), Milk (100ml), Sugar (2 tbsp), Cardamom (2 pods), Ice cubes (5)", 69.0,
                "https://media.istockphoto.com/id/806310742/photo/authentic-indian-cold-drink-made-up-of-curd-milk-malai-called-lassi.jpg?s=2048x2048&w=is&k=20&c=7VS9GSNdUMzoSfNBPPR2y0va335V7WoHH3f0Nq6s5cQ=");

        // Restaurant 2: Italian
        Restaurant r2 = new Restaurant();
        r2.setName(" Urban Pizza House");
        r2.setCuisine("Italian");
        r2.setImageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80");
        r2.setRating(4.5);
        restaurantRepository.save(r2);

        saveFood(r2, "Margherita Pizza", "Fresh mozzarella & tomato", 299.0,
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80");
        saveFood(r2, "Farmhouse Pizza", "Loaded with fresh vegetables", 349.0,
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80");
        saveFood(r2, "Cheese Garlic Bread", "Crispy with cheese & garlic", 139.0,
                "https://media.istockphoto.com/id/1441714834/photo/fresh-garlic-bread-with-cheese-and-spices-on-the-wooden-table.jpg?s=2048x2048&w=is&k=20&c=Sg5cDSAqy1p4J6vAJzLm1fSPwKAZ9_yUsbQWSHNbxos=");
        saveFood(r2, "Pasta Carbonara", "Creamy pasta with bacon", 279.0,
                "https://media.istockphoto.com/id/488960908/photo/homemade-pasta.jpg?s=2048x2048&w=is&k=20&c=_FIzwfbhZ_hD_4kyFaXwki4SPLfaInf9GToj4ZUWm9I=");
        saveFood(r2, "Alfredo Pasta", "Smooth cream sauce pasta", 269.0,
                "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&auto=format&fit=crop&q=80");
        saveFood(r2, "Pepperoni Pizza", "Classic with pepperoni", 329.0,
                "https://media.istockphoto.com/id/154935188/photo/pepperoni-pizza.jpg?s=2048x2048&w=is&k=20&c=izXB3hvMsXGtgt3B7PbM4rXTz1vpx0aDEvdVUvb9wqg=");
        saveFood(r2, "Tiramisu", "Italian coffee dessert", 179.0,
                "https://media.istockphoto.com/id/1314791086/photo/tiramisu-traditional-italian-dessert-on-white-plate.jpg?s=2048x2048&w=is&k=20&c=5dBfZVpoRymFEj7zsvFozyBLRxpYp2CBeA_WJWYGzRw=");
        saveFood(r2, "Caesar Salad", "Romaine lettuce with croutons", 199.0,
                "https://media.istockphoto.com/id/1987499256/photo/salad-in-black-bowl-at-dark-background.jpg?s=2048x2048&w=is&k=20&c=ZuA8G4sO3M56V_1xHU8cPiCUdMy6zlZb0uaNm7X0Fls=");

        // Restaurant 3: Chinese
        Restaurant r3 = new Restaurant();
        r3.setName("🥢 Golden Dragon");
        r3.setCuisine("Chinese");
        r3.setImageUrl("https://media.istockphoto.com/id/1433134521/photo/philadelphia-sushi-with-avocado-on-black-plate.jpg?s=1024x1024&w=is&k=20&c=5DVCceU2z1wNk8b5S1Yz62s6hEaVxTxHvqoLYJunjvs=");
        r3.setRating(4.3);
        restaurantRepository.save(r3);

        saveFood(r3, "Chow Mein", "Stir-fried noodles with vegetables", 199.0,
                "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format&fit=crop&q=80");
        saveFood(r3, "Fried Rice", "Basmati rice with eggs & veggies", 189.0,
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80");
        saveFood(r3, "Manchurian Balls", "Crispy fried vegetable balls", 219.0,
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&auto=format&fit=crop&q=80");
        saveFood(r3, "Sweet & Sour Chicken", "Tangy chicken with bell peppers", 249.0,
                "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80");
        saveFood(r3, "Spring Rolls", "Crispy rolls with filling", 129.0,
                "https://media.istockphoto.com/id/1371154829/photo/fried-spring-roll-with-chicken-vietnamese-food-top-view.jpg?s=612x612&w=0&k=20&c=rE_c3kY44eLRzwMCRhdC45XYl1yLy7ZOdyfVWwacKJ8=");
        saveFood(r3, "Szechuan Noodles", "Spicy noodles in peanut sauce", 199.0,
                "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop&q=80");
        saveFood(r3, "Kung Pao", "Steamed Chinese buns", 159.0,
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&auto=format&fit=crop&q=80");
        saveFood(r3, "Hot & Sour Soup", "Classic Chinese soup", 179.0,
                "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80");

        // Restaurant 4: South Indian
        Restaurant r4 = new Restaurant();
        r4.setName("🍲 Dosa Corner");
        r4.setCuisine("South Indian");
        r4.setImageUrl("https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        r4.setRating(4.4);
        restaurantRepository.save(r4);

        saveFood(r4, "Masala Dosa", "Crispy crepe with spiced potatoes", 179.0,
                "https://media.istockphoto.com/id/942682776/photo/masala-dosa-indian-breakfast-crepes-with-spicy-potato-filling.jpg?s=612x612&w=0&k=20&c=SCyxwiWKxy7LAXaGlfhnlUabTfRkxQBuTFUsqUx-VDk=");
        saveFood(r4, "Idli Sambar", "Steamed rice cakes with lentil curry", 129.0,
                "https://media.istockphoto.com/id/2159618247/photo/idli-vada-with-sambar.jpg?s=2048x2048&w=is&k=20&c=LUtmOcJ4SWeDosT0XqoeRlp9Uta2tt037SKMBS-iX7U=");
        saveFood(r4, "Vada", "Crispy fried lentil doughnuts", 99.0,
                "https://media.istockphoto.com/id/1262305920/photo/tea-time-snack-dal-vada-or-parippu-vada-or-paruppu-vadai-deep-fried-snacks-savory-food-from.jpg?s=612x612&w=0&k=20&c=Dxeb2eSaXCiumc_muijW3R-T7GBNnSxVuc0J0LS3DOo=");
        saveFood(r4, "Uttapam", "Savory pancake with toppings", 149.0,
                "https://media.istockphoto.com/id/1280277658/photo/south-indian-breakfast-pancakes-uttapam.jpg?s=612x612&w=0&k=20&c=GADTZVjq4jK-g2jcIffjwgU1Db28Xj-6foOObCCkO1I=");
        saveFood(r4, "Pesarattu", "Green moong crepe", 139.0,
                "https://media.istockphoto.com/id/1465606833/photo/indian-food-moong-dal-chilla-is-ready-to-eat.jpg?s=2048x2048&w=is&k=20&c=o2Fba8GI9bCrR7luYZwtB_e29SXv_P5F9qXqwQLTNfM=");
        saveFood(r4, "Sambhar Rice", "Rice with vegetable stew", 169.0,
                "https://media.istockphoto.com/id/1255857672/photo/sambar-rice-south-indian-food.jpg?s=612x612&w=0&k=20&c=VhlworUvKfttcWGMK3D4KSJYh5ycckuy69N6GrTQIa4=");
        saveFood(r4, "Medu Vada", "Soft lentil donuts", 119.0,
                "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80");
        saveFood(r4, "Coconut Chutney", "Fresh coconut chutney", 79.0,
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80");

        // Restaurant 5: Burgers & Fast Food
        Restaurant r5 = new Restaurant();
        r5.setName("🍔 Burger Barn");
        r5.setCuisine("Fast Food");
        r5.setImageUrl("https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop&q=80");
        r5.setRating(4.2);
        restaurantRepository.save(r5);

        saveFood(r5, "Classic Burger", "Beef patty with cheese", 199.0,
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "Veggie Burger", "Plant-based patty", 169.0,
                "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "Double Cheese Burger", "Double patty with 2 cheese slices", 249.0,
                "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "Chicken Burger", "Crispy fried chicken breast", 189.0,
                "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "French Fries", "Crispy fried potatoes", 79.0,
                "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "Milkshake", "Creamy vanilla shake", 99.0,
                "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "Onion Rings", "Crispy fried onion rings", 89.0,
                "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80");
        saveFood(r5, "Ice Cream Sundae", "Vanilla ice cream with toppings", 129.0,
                "https://media.istockphoto.com/id/184953075/photo/ice-cream.jpg?s=1024x1024&w=is&k=20&c=HDTxpav9g4PwZEzh3hEkV0pHxVYLlaMLODwABNgUVVs=");

        // Restaurant 6: Cafe & Desserts
        Restaurant r6 = new Restaurant();
        r6.setName("☕ Sweet Dreams Cafe");
        r6.setCuisine("Cafe & Desserts");
        r6.setImageUrl("https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=80");
        r6.setRating(4.7);
        restaurantRepository.save(r6);

        saveFood(r6, "Cappuccino", "Rich espresso with milk foam", 129.0,
                "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&auto=format&fit=crop&q=80");
        saveFood(r6, "Chocolate Cake", "Moist chocolate layer cake", 149.0,
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80");
        saveFood(r6, "Cheesecake", "Creamy New York style", 179.0,
                "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=80");
        saveFood(r6, "Iced Coffee", "Cold brew with ice", 99.0,
                "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r6, "Brownie", "Warm chocolate brownie", 89.0,
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80");
        saveFood(r6, "Latte", "Espresso with steamed milk", 119.0,
                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80");
        saveFood(r6, "Muffin", "Blueberry muffin with streusel", 159.0,
                "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r6, "Donut", "Glazed donut with sprinkles", 79.0,
                "https://images.unsplash.com/photo-1527515545081-5db817172677?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

        // Restaurant 7: Mexican
        Restaurant r7 = new Restaurant();
        r7.setName("🌮 Taco Fiesta");
        r7.setCuisine("Mexican");
        r7.setImageUrl("https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&auto=format&fit=crop&q=80");
        r7.setRating(4.3);
        restaurantRepository.save(r7);

        saveFood(r7, "Chicken Tacos", "Soft tacos with chicken", 219.0,
                "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80");
        saveFood(r7, "Vegetable Burrito", "Rolled tortilla with veggies", 199.0,
                "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop&q=80");
        saveFood(r7, "Nachos Supreme", "Crispy nachos with toppings", 249.0,
                "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80");
        saveFood(r7, "Quesadilla", "Grilled tortilla with cheese", 189.0,
                "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&auto=format&fit=crop&q=80");
        saveFood(r7, "Enchiladas", "Rolled tortillas in chili sauce", 229.0,
                "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=400&auto=format&fit=crop&q=80");
        saveFood(r7, "Guacamole Dip", "Fresh avocado with chips", 129.0,
                "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r7, "Churros", "Fried dough pastry with cinnamon", 99.0,
                "https://media.istockphoto.com/id/2154912399/photo/churros-with-hot-chocolate-sauce-sugar-and-cinnamon.jpg?s=2048x2048&w=is&k=20&c=NhHJHaaAYbsYXdUw9ta8A6cDFAF34napAhfW-dpVTCU=");
        saveFood(r7, "Salsa", "Spicy tomato salsa", 89.0,
                "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80");

        // Restaurant 8: Asian Fusion
        Restaurant r8 = new Restaurant();
        r8.setName("🥘 Wok Express");
        r8.setCuisine("Asian Fusion");
        r8.setImageUrl("https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80");
        r8.setRating(4.4);
        restaurantRepository.save(r8);

        saveFood(r8, "Pad Thai", "Thai noodles with peanuts", 229.0,
                "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=80");
        saveFood(r8, "Satay Chicken", "Grilled skewers with peanut sauce", 249.0,
                "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&auto=format&fit=crop&q=80");
        saveFood(r8, "Tom Yum Soup", "Spicy lemongrass soup", 189.0,
                "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80");
        saveFood(r8, "Green Curry", "Thai green chicken curry", 259.0,
                "https://plus.unsplash.com/premium_photo-1679435364636-9ec5e2db10a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r8, "Miso Ramen", "Japanese noodle soup", 219.0,
                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80");
        saveFood(r8, "Spring Rolls", "Fresh mint & shrimp rolls", 139.0,
                "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r8, "Dumplings", "Steamed vegetable dumplings", 189.0,
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&auto=format&fit=crop&q=80");
        saveFood(r8, "Fried Rice", "Asian style fried rice", 179.0,
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80");

        // Restaurant 9: Japanese
        Restaurant r9 = new Restaurant();
        r9.setName("🍱 Sakura Sushi");
        r9.setCuisine("Japanese");
        r9.setImageUrl("https://images.unsplash.com/photo-1602273660127-a0000560a4c1?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        r9.setRating(4.8);
        restaurantRepository.save(r9);

        saveFood(r9, "Salmon Sushi Roll", "Fresh salmon with avocado", 299.0,
                "https://media.istockphoto.com/id/917919440/photo/japanese-food.jpg?s=2048x2048&w=is&k=20&c=r5iZhHIuckdWdCkQpgwDmmwcqEi_oUTX5aCaFTrTroI=");
        saveFood(r9, "California Roll", "Crab, avocado, and cucumber", 349.0,
                "https://media.istockphoto.com/id/1291613177/photo/japanese-tempura-roll.jpg?s=2048x2048&w=is&k=20&c=Lgcu2E4pHmfwjAwQX3AHdiNgNyqU-ZXHRzI6blPIT2s=");
        saveFood(r9, "Tempura", "Lightly battered and fried vegetables", 229.0,
                "https://media.istockphoto.com/id/629614394/photo/delicious-shrimp-in-tempura-with-sweet-and-sour-sauce.jpg?s=2048x2048&w=is&k=20&c=jri2T2hNm0A6ZpDfPtRlRelUetP2oqj8W_p9Il4t6Kc=");
        saveFood(r9, "Miso Soup", "Traditional Japanese soup", 189.0,
                "https://media.istockphoto.com/id/155341533/photo/miso-soup.jpg?s=612x612&w=0&k=20&c=0614e4CQibtJ5RlwsHfdFuVPa9FS6QG38ITuBXoh4Qk=");
        saveFood(r9, "Edamame", "Steamed soybeans with sea salt", 119.0,
                "https://images.unsplash.com/photo-1774165916773-15b86d250ca1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r9, "Green Tea Ice Cream", "Matcha flavored ice cream", 149.0,
                "https://images.unsplash.com/photo-1583052606401-ba82199fffc9?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

        // Restaurant 10: Thai
        Restaurant r10 = new Restaurant();
        r10.setName("🍜 Bangkok Street");
        r10.setCuisine("Thai");
        r10.setImageUrl("https://images.unsplash.com/photo-1625749303513-f4f573b4429d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        r10.setRating(4.6);
        restaurantRepository.save(r10);

        saveFood(r10, "Pad See Ew", "Stir-fried rice noodles with soy sauce", 199.0,
                "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=80");
        saveFood(r10, "Tom Kha Gai", "Chicken and rice soup", 179.0,
                "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80");
        saveFood(r10, "Mango Sticky Rice", "Sweet mango with coconut rice", 219.0,
                "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=80");
        saveFood(r10, "Thai Iced Tea", "Cha Yen with ice", 89.0,
                "https://images.unsplash.com/photo-1644204010193-a35de7b0d702?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        saveFood(r10, "Pork Satay", "Grilled pork skewers", 259.0,
                "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&auto=format&fit=crop&q=80");

        // Restaurant 11: Continental
        Restaurant r11 = new Restaurant();
        r11.setName("🥂 The Continental");
        r11.setCuisine("Continental");
        r11.setImageUrl("https://images.unsplash.com/photo-1716831312304-109948b8ccfd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        r11.setRating(4.4);
        restaurantRepository.save(r11);

        saveFood(r11, "Grilled Chicken Steak", "Tender grilled chicken breast", 329.0,
                "https://media.istockphoto.com/id/2149800114/photo/portion-of-grilled-chicken-breast-with-a-side-dish-of-mashed-potatoes-and-broccoli-close-up.jpg?s=2048x2048&w=is&k=20&c=Wj56cSwa8rUJR7Dr3b-JwXKybFm6iHw4tFDy81ehPmQ=");
        saveFood(r11, "Mashed Potatoes", "Creamy mashed potatoes with herbs", 189.0,
                "https://media.istockphoto.com/id/154953186/photo/close-up-of-mashed-potatoes-served-on-white-ceramic-plate.jpg?s=2048x2048&w=is&k=20&c=j6KLNWJN2JNGdeAXD4ThnM1Sbn2gdEM4nJTFUeBR_5Q=");
        saveFood(r11, "Grilled Salmon", "Atlantic salmon with lemon butter", 379.0,
                "https://media.istockphoto.com/id/1281404116/photo/fried-salmon-steaks-fried-potatoes-and-fresh-vegetables-on-wooden-table.jpg?s=2048x2048&w=is&k=20&c=y1d9iHUwPbBwTU7Gn0AdJ4RAGvH982Q19iqC6wLWr9c=");
        saveFood(r11, "Caesar Salad", "Romaine lettuce with parmesan", 219.0,
                "https://media.istockphoto.com/id/534139231/photo/healthy-grilled-chicken-caesar-salad.jpg?s=2048x2048&w=is&k=20&c=FU8EdTmvUGAQ5YFOa8Kpk-hltGDATWupNlNAwLOMivc=");
        saveFood(r11, "Chocolate Mousse", "Rich chocolate dessert", 199.0,
                "https://media.istockphoto.com/id/1286334129/photo/chocolate-mousse-brownies-with-raspberry-on-dark-background.jpg?s=2048x2048&w=is&k=20&c=JVM-VjK6vskiesV05URGzm63V9EAfx6ns0Jfs6IrGTQ=");
        saveFood(r11, "Wine Selection", "Premium wine collection", 449.0,
                "https://media.istockphoto.com/id/1030932114/photo/two-glasses-of-red-wine-in-the-vineyard.jpg?s=2048x2048&w=is&k=20&c=Tu5XC5XR_Svcli1rK6e6Fk_1vW1KXqqNu4JPbsgsOLo=");
        saveFood(r11, "Bread Basket", "Assorted breads with butter", 159.0,
                "https://media.istockphoto.com/id/507021914/photo/assorted-croissand-and-bread.jpg?s=1024x1024&w=is&k=20&c=qNysTFgqaWcTxIqwSNz2A5k--NawGBhtYKf8935gK8Y=");

        // Restaurant 12: Mediterranean
        Restaurant r12 = new Restaurant();
        r12.setName("🫒 Mediterranean Delights");
        r12.setCuisine("Mediterranean");
        r12.setImageUrl("https://media.istockphoto.com/id/185325476/photo/tapas-and-red-wine.jpg?s=2048x2048&w=is&k=20&c=XgDGhQHduSClXTn1RNGlRBNt6u0na4Hz0sViqXblhZA=");
        r12.setRating(4.5);
        restaurantRepository.save(r12);

        saveFood(r12, "Hummus Platter", "Various hummus flavors with pita", 249.0,
                "https://media.istockphoto.com/id/1264685483/photo/greek-falafel-hummus-plate.jpg?s=2048x2048&w=is&k=20&c=2X2Y2l5-njLGctV5gxoiY0wXKGk35jXOZCvnbWenLkQ=");
        saveFood(r12, "Falafel Wrap", "Crispy falafel with tahini sauce", 189.0,
                "https://media.istockphoto.com/id/2259241057/photo/beef-mediterranean-wrap.jpg?s=1024x1024&w=is&k=20&c=fn7-jdm1dEXKOGjOFsOoCSSr4ujUZhg6ty-6xTqvc1o=");
        saveFood(r12, "Greek Salad", "Fresh vegetables with feta cheese", 199.0,
                "https://media.istockphoto.com/id/515747088/photo/greek-mediterranean-salad.jpg?s=2048x2048&w=is&k=20&c=v7tHo7y3Z-HKz87V3GzVfFIvA0tF-dp6R2mbdo1GHys=");
        saveFood(r12, "Pita Bread", "Warm pita bread with olive oil", 99.0,
                "https://media.istockphoto.com/id/860985288/photo/close-up-of-kebab-sandwich.jpg?s=2048x2048&w=is&k=20&c=RY8K1M488MGhcBesjDRoFV3VzE1xKpIpXCS7w0PERvE=");
        saveFood(r12, "Baba Ghanoush", "Smoky eggplant dip with pita", 179.0,
                "https://media.istockphoto.com/id/1308477268/photo/an-oriental-dish-of-baked-eggplant-babaganush-with-spices-herbs-lettuce-and-oriental.jpg?s=2048x2048&w=is&k=20&c=FEhKaSVAqVzBmkr-trqgBXUZScg-3-Dfl1UDgtOzawk=");
        saveFood(r12, "Lamb Kofta", "Grilled lamb meatballs", 279.0,
                "https://media.istockphoto.com/id/492864863/photo/kofta-tagine-kefta-tagine-moroccan-cuisine.jpg?s=1024x1024&w=is&k=20&c=qGsREx7NP4IcSRdoAL2Ldb3CMf2LgVFwlgrxs7R2XsM=");
        saveFood(r12, "Tzatziki Sauce", "Cool yogurt cucumber sauce", 89.0,
                "https://media.istockphoto.com/id/537372630/photo/homemade-turkey-or-chicken-meat-shish-kebab-skewers-with-ketchup.jpg?s=2048x2048&w=is&k=20&c=gsuWG_D4r23c961eamjQM4ZishqgYf3mJFAOX_0sWfw=");
    }

    private void saveFood(Restaurant restaurant, String name, String description, Double price, String imageUrl) {
        FoodItem foodItem = new FoodItem();
        foodItem.setRestaurant(restaurant);
        foodItem.setName(name);
        foodItem.setDescription(description);
        foodItem.setPrice(price);
        foodItem.setImageUrl(imageUrl);
        foodItemRepository.save(foodItem);
    }
}