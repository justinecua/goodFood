"""Sample restaurants, dishes and reviewers used by the seed_* commands.

Kept out of the command modules themselves so `seed_sample_data`,
`seed_reviews` and `refresh_rankings` can share one dataset. The leading
underscore keeps Django's command discovery from picking it up.

Coordinates are real points around Iligan City and Northern Mindanao, so the
location-aware "top dishes / top restaurants" ranking has something sensible
to sort by. The diner's device sits somewhere near Iligan (8.228, 124.245),
which makes the first few restaurants "nearby" and the Cagayan de Oro /
Ozamiz ones a long drive away.
"""

# Cuisine categories (restaurant_category) and dish categories are created on
# demand from the names used below.

DISH_CATEGORIES = [
    ("Appetizers", "Small plates to start the meal."),
    ("Soups", "Broths, stews and hot bowls."),
    ("Mains", "Rice toppings, grills and main courses."),
    ("Noodles", "Pancit, ramen and other noodle dishes."),
    ("Seafood", "Fish, prawns and shellfish."),
    ("Desserts", "Sweets, kakanin and frozen treats."),
    ("Drinks", "Coffee, shakes and refreshments."),
]

# Monday-Sunday opening template reused by every restaurant unless it
# overrides `hours`.
DEFAULT_HOURS = [
    ("Monday", "10:00", "21:00", False),
    ("Tuesday", "10:00", "21:00", False),
    ("Wednesday", "10:00", "21:00", False),
    ("Thursday", "10:00", "21:00", False),
    ("Friday", "10:00", "22:00", False),
    ("Saturday", "09:00", "22:00", False),
    ("Sunday", "09:00", "20:00", False),
]

RESTAURANTS = [
    {
        "restaurant_name": "Tita Bebang's Kusina",
        "email": "hello@titabebangs.ph",
        "contact_number": "09171000101",
        "address": "Roxas Ave. corner Badelles St., Poblacion",
        "restaurant_description": (
            "Home-style Filipino cooking in a converted family house. "
            "Everything is cooked in clay pots over wood fire."
        ),
        "owner": {"username": "bebang_owner", "first_name": "Bernadette", "last_name": "Lim"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2280", "longitude": "124.2452",
        },
        "categories": ["Filipino", "Home-style", "Family Dining"],
        "branches": [
            {"branch_name": "Pala-o Branch", "address": "Jose Aguilar St., Pala-o",
             "contact_number": "09171000102", "latitude": "8.2364", "longitude": "124.2411"},
        ],
        "dishes": [
            {"dish_name": "Kare-Kare Bagnet", "dish_category": "Mains", "dish_price": "420.00",
             "dish_description": "Crackling bagnet over oxtail peanut stew with banana heart and pechay.",
             "is_signature": True,
             "how_to_eat": "Add bagoong a little at a time, then spoon over hot rice."},
            {"dish_name": "Sinigang na Baboy sa Sampalok", "dish_category": "Soups", "dish_price": "320.00",
             "dish_description": "Pork belly in a sour tamarind broth with gabi, radish and kangkong.",
             "is_best_seller": True},
            {"dish_name": "Lumpiang Ubod", "dish_category": "Appetizers", "dish_price": "185.00",
             "dish_description": "Fresh heart-of-palm rolls in a soft crepe with garlic peanut sauce."},
            {"dish_name": "Adobong Manok sa Gata", "dish_category": "Mains", "dish_price": "290.00",
             "dish_description": "Chicken adobo finished with coconut cream and green chilli.",
             "is_best_seller": True},
            {"dish_name": "Pancit Bihon Guisado", "dish_category": "Noodles", "dish_price": "240.00",
             "dish_description": "Thin rice noodles tossed with pork, shrimp and shredded vegetables."},
            {"dish_name": "Leche Flan", "dish_category": "Desserts", "dish_price": "120.00",
             "dish_description": "Steamed custard with a dark caramel top, made in llaneras every morning."},
        ],
    },
    {
        "restaurant_name": "The Crunch Fried Chicken",
        "email": "orders@thecrunch.ph",
        "contact_number": "09171000201",
        "address": "Quezon Ave. Extension, Tibanga",
        "restaurant_description": (
            "Buttermilk-brined fried chicken, hand-breaded to order. "
            "Counter service with a small dining area."
        ),
        "owner": {"username": "crunch_owner", "first_name": "Marco", "last_name": "Estrella"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2415", "longitude": "124.2378",
        },
        "categories": ["Fried Chicken", "Fast Food", "American"],
        "branches": [],
        "dishes": [
            {"dish_name": "Original Crunch (2 pcs)", "dish_category": "Mains", "dish_price": "199.00",
             "dish_description": "Two pieces of buttermilk fried chicken with rice and gravy.",
             "is_signature": True, "is_best_seller": True,
             "preparation_notes": "Fried to order, allow 12 minutes."},
            {"dish_name": "Honey Butter Chicken", "dish_category": "Mains", "dish_price": "229.00",
             "dish_description": "Fried chicken glazed in honey butter with toasted sesame."},
            {"dish_name": "Spicy Buffalo Wings", "dish_category": "Appetizers", "dish_price": "265.00",
             "dish_description": "Six wings tossed in cayenne butter, blue cheese dip on the side."},
            {"dish_name": "Chicken Sopas", "dish_category": "Soups", "dish_price": "140.00",
             "dish_description": "Creamy macaroni soup with shredded chicken and cabbage."},
            {"dish_name": "Loaded Cheese Fries", "dish_category": "Appetizers", "dish_price": "175.00",
             "dish_description": "Thick-cut fries under cheese sauce, bacon bits and spring onion."},
            {"dish_name": "Iced Calamansi Tea", "dish_category": "Drinks", "dish_price": "85.00",
             "dish_description": "Cold-brewed black tea with calamansi and honey."},
        ],
    },
    {
        "restaurant_name": "Maranao Palapa House",
        "email": "kumain@palapahouse.ph",
        "contact_number": "09171000301",
        "address": "Mahayahay Road, near the public market",
        "restaurant_description": (
            "Maranao and Meranaw home cooking built around palapa - the "
            "scallion-and-ginger condiment the house makes fresh daily."
        ),
        "owner": {"username": "palapa_owner", "first_name": "Norhata", "last_name": "Macarambon"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2201", "longitude": "124.2510",
        },
        "categories": ["Maranao", "Halal", "Filipino"],
        "branches": [],
        "dishes": [
            {"dish_name": "Beef Rendang Maranao", "dish_category": "Mains", "dish_price": "350.00",
             "dish_description": "Beef slow-cooked in coconut and turmeric until the sauce clings.",
             "is_signature": True},
            {"dish_name": "Piaparan a Manok", "dish_category": "Mains", "dish_price": "310.00",
             "dish_description": "Chicken in grated coconut, turmeric and palapa.",
             "is_best_seller": True,
             "how_to_eat": "Eat with plain rice - the coconut carries all the seasoning."},
            {"dish_name": "Chicken Randang", "dish_category": "Mains", "dish_price": "295.00",
             "dish_description": "Drier, spicier chicken braise with toasted coconut."},
            {"dish_name": "Tiyula Itum", "dish_category": "Soups", "dish_price": "330.00",
             "dish_description": "Beef soup blackened with burnt coconut, ginger and lemongrass."},
            {"dish_name": "Palapa Fried Rice", "dish_category": "Mains", "dish_price": "160.00",
             "dish_description": "Fried rice folded with the house palapa and fried garlic."},
            {"dish_name": "Dodol", "dish_category": "Desserts", "dish_price": "110.00",
             "dish_description": "Sticky coconut and brown sugar sweet, cut into squares."},
        ],
    },
    {
        "restaurant_name": "Timoga Seafood Grill",
        "email": "reserve@timogagrill.ph",
        "contact_number": "09171000401",
        "address": "Timoga Springs Road, Buru-un",
        "restaurant_description": (
            "Open-air grill beside the Timoga springs. Pick your fish from "
            "the ice bed and it goes straight on the coals."
        ),
        "owner": {"username": "timoga_owner", "first_name": "Ruel", "last_name": "Bacolod"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.1783", "longitude": "124.1889",
        },
        "categories": ["Seafood", "Grill", "Filipino"],
        "branches": [
            {"branch_name": "Highway Branch", "address": "National Highway, Sta. Filomena",
             "contact_number": "09171000402", "latitude": "8.2032", "longitude": "124.2205"},
        ],
        "dishes": [
            {"dish_name": "Grilled Blue Marlin Belly", "dish_category": "Seafood", "dish_price": "480.00",
             "dish_description": "Thick belly cut grilled over coals, brushed with calamansi butter.",
             "is_signature": True, "is_best_seller": True},
            {"dish_name": "Baked Scallops (6 pcs)", "dish_category": "Seafood", "dish_price": "290.00",
             "dish_description": "Scallops on the half shell under garlic butter and cheese."},
            {"dish_name": "Sinugbang Bangus", "dish_category": "Seafood", "dish_price": "320.00",
             "dish_description": "Whole milkfish stuffed with tomato and onion, grilled in banana leaf."},
            {"dish_name": "Kinilaw na Tanigue", "dish_category": "Appetizers", "dish_price": "260.00",
             "dish_description": "Raw wahoo cured in vinegar with ginger, chilli and coconut milk.",
             "how_to_eat": "Best straight from the bowl while still cold, before the rice."},
            {"dish_name": "Sinigang na Hipon", "dish_category": "Soups", "dish_price": "340.00",
             "dish_description": "Prawns in a sour broth with kangkong and green chilli."},
            {"dish_name": "Buko Halo-Halo", "dish_category": "Desserts", "dish_price": "165.00",
             "dish_description": "Halo-halo served inside a young coconut shell."},
        ],
    },
    {
        "restaurant_name": "Cafe Aurora",
        "email": "hi@cafeaurora.ph",
        "contact_number": "09171000501",
        "address": "Aguinaldo St., Poblacion",
        "restaurant_description": (
            "Third-wave coffee bar and all-day brunch spot roasting single-"
            "origin beans from Bukidnon and Sultan Kudarat."
        ),
        "owner": {"username": "aurora_owner", "first_name": "Isabel", "last_name": "Ramos"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2296", "longitude": "124.2437",
        },
        "categories": ["Cafe", "Brunch", "Coffee"],
        "branches": [],
        "hours": [
            ("Monday", "07:00", "20:00", False),
            ("Tuesday", "07:00", "20:00", False),
            ("Wednesday", "07:00", "20:00", False),
            ("Thursday", "07:00", "20:00", False),
            ("Friday", "07:00", "22:00", False),
            ("Saturday", "07:00", "22:00", False),
            ("Sunday", None, None, True),
        ],
        "dishes": [
            {"dish_name": "Sagada Latte", "dish_category": "Drinks", "dish_price": "150.00",
             "dish_description": "Double shot of Sagada arabica with steamed milk.",
             "is_best_seller": True},
            {"dish_name": "Ube Cheesecake Slice", "dish_category": "Desserts", "dish_price": "180.00",
             "dish_description": "Baked cheesecake swirled with purple yam jam."},
            {"dish_name": "Truffle Mushroom Toast", "dish_category": "Appetizers", "dish_price": "260.00",
             "dish_description": "Sourdough with garlic cream, sauteed mushrooms and truffle oil.",
             "is_signature": True},
            {"dish_name": "Longganisa Breakfast Plate", "dish_category": "Mains", "dish_price": "245.00",
             "dish_description": "Sweet local longganisa, garlic rice, egg and atchara."},
            {"dish_name": "Cold Brew Tonic", "dish_category": "Drinks", "dish_price": "165.00",
             "dish_description": "18-hour cold brew over tonic water and orange peel."},
            {"dish_name": "Bibingka Waffle", "dish_category": "Desserts", "dish_price": "195.00",
             "dish_description": "Rice-flour waffle with salted egg, kesong puti and coconut caramel."},
        ],
    },
    {
        "restaurant_name": "Ramen Kita",
        "email": "hello@ramenkita.ph",
        "contact_number": "09171000601",
        "address": "Del Pilar St., Poblacion",
        "restaurant_description": (
            "Twelve-seat ramen counter. One pork bone broth, simmered "
            "eighteen hours, four ways to order it."
        ),
        "owner": {"username": "kita_owner", "first_name": "Kenji", "last_name": "Tanaka"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2321", "longitude": "124.2419",
        },
        "categories": ["Japanese", "Ramen", "Noodles"],
        "branches": [],
        "dishes": [
            {"dish_name": "Tonkotsu Ramen", "dish_category": "Noodles", "dish_price": "380.00",
             "dish_description": "Eighteen-hour pork broth, chashu, ajitama and black garlic oil.",
             "is_signature": True, "is_best_seller": True,
             "how_to_eat": "Drink a spoonful of broth first, then eat the noodles quickly while firm."},
            {"dish_name": "Spicy Miso Ramen", "dish_category": "Noodles", "dish_price": "400.00",
             "dish_description": "Miso tare with chilli oil, ground pork and beansprouts."},
            {"dish_name": "Shoyu Ramen", "dish_category": "Noodles", "dish_price": "360.00",
             "dish_description": "Lighter soy-based broth with menma and nori."},
            {"dish_name": "Karaage (5 pcs)", "dish_category": "Appetizers", "dish_price": "220.00",
             "dish_description": "Marinated chicken thigh, potato-starch fried, yuzu mayo."},
            {"dish_name": "Gyoza (6 pcs)", "dish_category": "Appetizers", "dish_price": "210.00",
             "dish_description": "Pan-fried pork and cabbage dumplings with a crisp skirt."},
            {"dish_name": "Matcha Soft Serve", "dish_category": "Desserts", "dish_price": "140.00",
             "dish_description": "Uji matcha soft serve with roasted soybean powder."},
        ],
    },
    {
        "restaurant_name": "Lechon Belly ni Manoy",
        "email": "manoy@lechonbelly.ph",
        "contact_number": "09171000701",
        "address": "Tibanga Highway, beside the covered court",
        "restaurant_description": (
            "Roast pork belly rolled with lemongrass and chilli, carved to "
            "order. Takeout counter with a few tables."
        ),
        "owner": {"username": "manoy_owner", "first_name": "Rodel", "last_name": "Suarez"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2447", "longitude": "124.2331",
        },
        "categories": ["Lechon", "Filipino", "Takeout"],
        "branches": [],
        "dishes": [
            {"dish_name": "Lechon Belly (1/2 kilo)", "dish_category": "Mains", "dish_price": "450.00",
             "dish_description": "Lemongrass-stuffed pork belly, crackling skin, chopped to order.",
             "is_signature": True, "is_best_seller": True,
             "preparation_notes": "Sold until the day's rolls run out, usually by 6pm."},
            {"dish_name": "Spicy Lechon Sisig", "dish_category": "Mains", "dish_price": "280.00",
             "dish_description": "Chopped lechon on a sizzling plate with calamansi and chilli."},
            {"dish_name": "Dinuguan sa Lechon", "dish_category": "Mains", "dish_price": "240.00",
             "dish_description": "Pork blood stew made with the trimmings, served with puto."},
            {"dish_name": "Chicharon Bulaklak", "dish_category": "Appetizers", "dish_price": "230.00",
             "dish_description": "Crisp-fried ruffle fat with spiced vinegar."},
            {"dish_name": "Garlic Rice Bowl", "dish_category": "Mains", "dish_price": "75.00",
             "dish_description": "Fried rice with plenty of toasted garlic."},
            {"dish_name": "Buko Pandan Salad", "dish_category": "Desserts", "dish_price": "130.00",
             "dish_description": "Young coconut and pandan jelly in sweet cream."},
        ],
    },
    {
        "restaurant_name": "Bahay Kubo Vegetarian",
        "email": "kain@bahaykubo.ph",
        "contact_number": "09171000801",
        "address": "Villaverde St., Pala-o",
        "restaurant_description": (
            "Meat-free Filipino cooking using vegetables from the family "
            "farm in Bukidnon. Mostly vegan, all of it cheap."
        ),
        "owner": {"username": "kubo_owner", "first_name": "Grace", "last_name": "Delos Reyes"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2372", "longitude": "124.2464",
        },
        "categories": ["Vegetarian", "Vegan", "Filipino"],
        "branches": [],
        "dishes": [
            {"dish_name": "Laing sa Gata", "dish_category": "Mains", "dish_price": "180.00",
             "dish_description": "Dried taro leaves simmered in coconut milk with chilli.",
             "is_signature": True},
            {"dish_name": "Ginataang Langka", "dish_category": "Mains", "dish_price": "175.00",
             "dish_description": "Young jackfruit in coconut milk with malunggay."},
            {"dish_name": "Tofu Sisig", "dish_category": "Mains", "dish_price": "195.00",
             "dish_description": "Crisp tofu on a sizzling plate with onion and calamansi.",
             "is_best_seller": True},
            {"dish_name": "Monggo Guisado", "dish_category": "Soups", "dish_price": "150.00",
             "dish_description": "Mung bean stew with ampalaya leaves and toasted garlic."},
            {"dish_name": "Pinakbet Tagalog", "dish_category": "Mains", "dish_price": "185.00",
             "dish_description": "Mixed vegetables in a light bagoong-free miso sauce."},
            {"dish_name": "Turon ng Saging", "dish_category": "Desserts", "dish_price": "95.00",
             "dish_description": "Caramelised banana and jackfruit spring rolls."},
        ],
    },
    {
        "restaurant_name": "Casa Iligan Bistro",
        "email": "book@casailigan.ph",
        "contact_number": "09171000901",
        "address": "Andres Bonifacio Ave., Poblacion",
        "restaurant_description": (
            "Spanish-Filipino bistro in a restored 1930s house. Long wine "
            "list and a wood-fired oven in the courtyard."
        ),
        "owner": {"username": "casa_owner", "first_name": "Antonio", "last_name": "Villanueva"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2259", "longitude": "124.2401",
        },
        "categories": ["Spanish", "Bistro", "Fine Dining"],
        "branches": [],
        "hours": [
            ("Monday", None, None, True),
            ("Tuesday", "17:00", "23:00", False),
            ("Wednesday", "17:00", "23:00", False),
            ("Thursday", "17:00", "23:00", False),
            ("Friday", "17:00", "00:00", False),
            ("Saturday", "16:00", "00:00", False),
            ("Sunday", "16:00", "22:00", False),
        ],
        "dishes": [
            {"dish_name": "Gambas al Ajillo", "dish_category": "Appetizers", "dish_price": "420.00",
             "dish_description": "Prawns in garlic, olive oil and dried chilli, served bubbling.",
             "is_best_seller": True,
             "how_to_eat": "Mop the oil with the bread before it cools - that is the point of the dish."},
            {"dish_name": "Paella Negra", "dish_category": "Mains", "dish_price": "890.00",
             "dish_description": "Squid ink rice with calamari and prawns, good for two.",
             "is_signature": True,
             "preparation_notes": "Cooked from raw rice, allow 35 minutes."},
            {"dish_name": "Callos a la Madrilena", "dish_category": "Mains", "dish_price": "520.00",
             "dish_description": "Tripe and chorizo stew with chickpeas and paprika."},
            {"dish_name": "Sopa de Ajo", "dish_category": "Soups", "dish_price": "260.00",
             "dish_description": "Garlic bread soup with paprika and a poached egg."},
            {"dish_name": "Wood-fired Chorizo Pizza", "dish_category": "Mains", "dish_price": "480.00",
             "dish_description": "Thin crust with local chorizo, manchego and honey."},
            {"dish_name": "Crema Catalana", "dish_category": "Desserts", "dish_price": "220.00",
             "dish_description": "Citrus and cinnamon custard under torched sugar."},
        ],
    },
    {
        "restaurant_name": "Tinolang Baboy Express",
        "email": "hello@tinolaexpress.ph",
        "contact_number": "09171001001",
        "address": "Zone 4, Sta. Filomena",
        "restaurant_description": (
            "Turo-turo carinderia doing one thing well: hot soup with rice, "
            "all day, for under two hundred pesos."
        ),
        "owner": {"username": "tinola_owner", "first_name": "Melchor", "last_name": "Paden"},
        "location": {
            "city": "Iligan City", "province": "Lanao del Norte", "region": "Region X",
            "country": "Philippines", "latitude": "8.2058", "longitude": "124.2243",
        },
        "categories": ["Carinderia", "Filipino", "Budget"],
        "branches": [],
        "dishes": [
            {"dish_name": "Tinolang Manok", "dish_category": "Soups", "dish_price": "150.00",
             "dish_description": "Ginger chicken soup with green papaya and chilli leaves.",
             "is_signature": True, "is_best_seller": True},
            {"dish_name": "Bulalo", "dish_category": "Soups", "dish_price": "290.00",
             "dish_description": "Beef shank and marrow bone broth with corn and cabbage."},
            {"dish_name": "Batchoy Iloilo", "dish_category": "Noodles", "dish_price": "160.00",
             "dish_description": "Pork broth noodles with chicharon and a raw egg stirred through."},
            {"dish_name": "Pork Nilaga", "dish_category": "Soups", "dish_price": "175.00",
             "dish_description": "Clear pork soup with saba banana, potato and pechay."},
            {"dish_name": "Ginataang Mais", "dish_category": "Desserts", "dish_price": "70.00",
             "dish_description": "Warm sweet corn and glutinous rice in coconut milk."},
            {"dish_name": "Sago't Gulaman", "dish_category": "Drinks", "dish_price": "45.00",
             "dish_description": "Tapioca pearls and jelly in brown sugar syrup."},
        ],
    },
    {
        "restaurant_name": "Bulanglang Cagayan",
        "email": "hello@bulanglangcdo.ph",
        "contact_number": "09171001101",
        "address": "Corrales Ave., Divisoria",
        "restaurant_description": (
            "Cagayan de Oro institution for pork sinuglaw and native "
            "chicken. Big tables, loud room, cold beer."
        ),
        "owner": {"username": "bulanglang_owner", "first_name": "Jonas", "last_name": "Abella"},
        "location": {
            "city": "Cagayan de Oro", "province": "Misamis Oriental", "region": "Region X",
            "country": "Philippines", "latitude": "8.4822", "longitude": "124.6472",
        },
        "categories": ["Filipino", "Grill", "Beer Garden"],
        "branches": [
            {"branch_name": "Limketkai Branch", "address": "Limketkai Center, Lapasan",
             "contact_number": "09171001102", "latitude": "8.4841", "longitude": "124.6553"},
        ],
        "dishes": [
            {"dish_name": "Sinuglaw", "dish_category": "Appetizers", "dish_price": "310.00",
             "dish_description": "Grilled pork belly tossed with tuna kinilaw and coconut vinegar.",
             "is_signature": True, "is_best_seller": True},
            {"dish_name": "Native Chicken Halang-Halang", "dish_category": "Soups", "dish_price": "380.00",
             "dish_description": "Free-range chicken in coconut milk, ginger and siling labuyo."},
            {"dish_name": "Grilled Pork Belly Liempo", "dish_category": "Mains", "dish_price": "290.00",
             "dish_description": "Marinated belly grilled over coals, spiced vinegar on the side."},
            {"dish_name": "Kilawin Kambing", "dish_category": "Appetizers", "dish_price": "340.00",
             "dish_description": "Goat cured in vinegar with ginger, onion and plenty of chilli."},
            {"dish_name": "Pancit Cabagan", "dish_category": "Noodles", "dish_price": "265.00",
             "dish_description": "Thick miki noodles with quail eggs, lechon carajay and vegetables."},
            {"dish_name": "Suman sa Lihiya", "dish_category": "Desserts", "dish_price": "90.00",
             "dish_description": "Lye-treated sticky rice logs with coconut caramel."},
        ],
    },
    {
        "restaurant_name": "Kagay-an Kapehan",
        "email": "brew@kagayankapehan.ph",
        "contact_number": "09171001201",
        "address": "Velez St., Cagayan de Oro",
        "restaurant_description": (
            "Coffee and pastry shop pouring beans grown on the slopes of "
            "Mt. Kitanglad. Opens before sunrise for the market crowd."
        ),
        "owner": {"username": "kagayan_owner", "first_name": "Liza", "last_name": "Ompoc"},
        "location": {
            "city": "Cagayan de Oro", "province": "Misamis Oriental", "region": "Region X",
            "country": "Philippines", "latitude": "8.4772", "longitude": "124.6435",
        },
        "categories": ["Cafe", "Coffee", "Bakery"],
        "branches": [],
        "dishes": [
            {"dish_name": "Kitanglad Pour Over", "dish_category": "Drinks", "dish_price": "180.00",
             "dish_description": "Single-origin arabica, brewed to order in a V60.",
             "is_signature": True},
            {"dish_name": "Salted Caramel Latte", "dish_category": "Drinks", "dish_price": "170.00",
             "dish_description": "Espresso, steamed milk and house salted caramel.",
             "is_best_seller": True},
            {"dish_name": "Pan de Sal Basket", "dish_category": "Appetizers", "dish_price": "120.00",
             "dish_description": "Six warm rolls with kesong puti and coconut jam."},
            {"dish_name": "Ensaymada Malagos", "dish_category": "Desserts", "dish_price": "150.00",
             "dish_description": "Buttery brioche with Malagos cheese and sugar."},
            {"dish_name": "Beef Tapa Rice Bowl", "dish_category": "Mains", "dish_price": "230.00",
             "dish_description": "Cured beef, garlic rice, fried egg and pickled papaya."},
            {"dish_name": "Tsokolate Batirol", "dish_category": "Drinks", "dish_price": "140.00",
             "dish_description": "Thick native cacao whisked at the table."},
        ],
    },
    {
        "restaurant_name": "Sinuglaw sa Baybay",
        "email": "kain@sinuglawbaybay.ph",
        "contact_number": "09171001301",
        "address": "Baybay Road, Opol",
        "restaurant_description": (
            "Beachfront shack on stilts. Everything is grilled outside and "
            "brought over on banana leaf."
        ),
        "owner": {"username": "baybay_owner", "first_name": "Diomedes", "last_name": "Ravelo"},
        "location": {
            "city": "Opol", "province": "Misamis Oriental", "region": "Region X",
            "country": "Philippines", "latitude": "8.5091", "longitude": "124.5723",
        },
        "categories": ["Seafood", "Grill", "Beachfront"],
        "branches": [],
        "dishes": [
            {"dish_name": "Grilled Squid with Palapa", "dish_category": "Seafood", "dish_price": "360.00",
             "dish_description": "Whole squid stuffed with tomato and onion, grilled over coals.",
             "is_signature": True},
            {"dish_name": "Crab in Coconut Milk", "dish_category": "Seafood", "dish_price": "520.00",
             "dish_description": "Mud crab simmered in gata with lemongrass and chilli.",
             "is_best_seller": True,
             "how_to_eat": "Use your hands - the sauce is the point, not the presentation."},
            {"dish_name": "Tuna Panga Grilled", "dish_category": "Seafood", "dish_price": "410.00",
             "dish_description": "Tuna jaw grilled slowly, soy-calamansi dip."},
            {"dish_name": "Sinigang na Isda sa Batwan", "dish_category": "Soups", "dish_price": "330.00",
             "dish_description": "Reef fish soured with batwan fruit instead of tamarind."},
            {"dish_name": "Kinilaw na Malasugi", "dish_category": "Appetizers", "dish_price": "280.00",
             "dish_description": "Marlin cured in coconut vinegar with ginger and red onion."},
            {"dish_name": "Fresh Buko Juice", "dish_category": "Drinks", "dish_price": "80.00",
             "dish_description": "Young coconut water served in the shell."},
        ],
    },
    {
        "restaurant_name": "Tita Cely's Panciteria",
        "email": "hello@titacely.ph",
        "contact_number": "09171001401",
        "address": "Rizal St., Ozamiz City",
        "restaurant_description": (
            "Chinese-Filipino panciteria running since 1968. Same three "
            "noodle dishes, same recipes, third generation cooking them."
        ),
        "owner": {"username": "cely_owner", "first_name": "Celia", "last_name": "Tan"},
        "location": {
            "city": "Ozamiz City", "province": "Misamis Occidental", "region": "Region X",
            "country": "Philippines", "latitude": "8.1465", "longitude": "123.8443",
        },
        "categories": ["Chinese", "Noodles", "Filipino"],
        "branches": [],
        "dishes": [
            {"dish_name": "Pancit Canton Guisado", "dish_category": "Noodles", "dish_price": "230.00",
             "dish_description": "Egg noodles with pork, shrimp, liver and cabbage.",
             "is_signature": True, "is_best_seller": True},
            {"dish_name": "Lomi Ozamiz", "dish_category": "Noodles", "dish_price": "210.00",
             "dish_description": "Thick noodles in a starchy pork broth with kikiam and egg."},
            {"dish_name": "Pancit Molo", "dish_category": "Soups", "dish_price": "195.00",
             "dish_description": "Pork dumplings in clear chicken broth with spring onion."},
            {"dish_name": "Lumpiang Shanghai (10 pcs)", "dish_category": "Appetizers", "dish_price": "180.00",
             "dish_description": "Thin pork rolls fried crisp, sweet chilli dip."},
            {"dish_name": "Sweet and Sour Lapu-Lapu", "dish_category": "Seafood", "dish_price": "460.00",
             "dish_description": "Whole grouper fried and sauced with pineapple and bell pepper."},
            {"dish_name": "Buchi (6 pcs)", "dish_category": "Desserts", "dish_price": "110.00",
             "dish_description": "Sesame balls with mung bean paste, fried to order."},
        ],
    },
    {
        "restaurant_name": "Highland Grill Bukidnon",
        "email": "reserve@highlandgrill.ph",
        "contact_number": "09171001501",
        "address": "Sayre Highway, Malaybalay",
        "restaurant_description": (
            "Steakhouse on a working cattle ranch, 1,200 metres up. Beef is "
            "dry-aged on site and cut to order."
        ),
        "owner": {"username": "highland_owner", "first_name": "Samuel", "last_name": "Cabrera"},
        "location": {
            "city": "Malaybalay", "province": "Bukidnon", "region": "Region X",
            "country": "Philippines", "latitude": "8.1575", "longitude": "125.1278",
        },
        "categories": ["Steakhouse", "Grill", "American"],
        "branches": [],
        "dishes": [
            {"dish_name": "Dry-aged Ribeye 300g", "dish_category": "Mains", "dish_price": "1250.00",
             "dish_description": "Twenty-eight day aged ribeye, salt and pepper, grilled over kiawe.",
             "is_signature": True,
             "preparation_notes": "Rested 8 minutes before serving - it will arrive about 25 minutes in."},
            {"dish_name": "Ranch Beef Salpicao", "dish_category": "Mains", "dish_price": "580.00",
             "dish_description": "Cubed tenderloin seared with garlic, soy and olive oil.",
             "is_best_seller": True},
            {"dish_name": "Bone Marrow Toast", "dish_category": "Appetizers", "dish_price": "340.00",
             "dish_description": "Roasted marrow bones with parsley salad and grilled bread."},
            {"dish_name": "Highland Onion Soup", "dish_category": "Soups", "dish_price": "280.00",
             "dish_description": "Slow-caramelised onions in beef broth under melted cheese."},
            {"dish_name": "Grilled Corn and Kesong Puti", "dish_category": "Appetizers", "dish_price": "190.00",
             "dish_description": "Charred sweet corn with white cheese and calamansi butter."},
            {"dish_name": "Strawberry Ice Cream Bukidnon", "dish_category": "Desserts", "dish_price": "160.00",
             "dish_description": "Churned with fruit from the highland farms."},
        ],
    },
]

# Diner accounts that leave the sample reviews.
REVIEWERS = [
    {"username": "diner_maria", "first_name": "Maria", "last_name": "Sandoval", "gender": "Female"},
    {"username": "diner_paolo", "first_name": "Paolo", "last_name": "Guzman", "gender": "Male"},
    {"username": "diner_ate_len", "first_name": "Lenlen", "last_name": "Bautista", "gender": "Female"},
    {"username": "diner_kuya_jek", "first_name": "Jericho", "last_name": "Ocampo", "gender": "Male"},
    {"username": "diner_shai", "first_name": "Shaira", "last_name": "Mangorsi", "gender": "Female"},
    {"username": "diner_toffee", "first_name": "Christopher", "last_name": "Yu", "gender": "Male"},
    {"username": "diner_bea", "first_name": "Beatriz", "last_name": "Nolasco", "gender": "Female"},
    {"username": "diner_migs", "first_name": "Miguel", "last_name": "Fernandez", "gender": "Male"},
]
