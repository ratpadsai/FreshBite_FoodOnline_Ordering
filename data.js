/* ==========================================================
   FreshBite — DATA LAYER
   All "database" content lives here as plain JS arrays/objects,
   per project spec (no backend / no real database).
   ========================================================== */

const RESTAURANTS = [
  { id:1, name:"Spice Route Kitchen", cuisine:"Indian", rating:4.5, priceRange:2, deliveryTime:"25-35 min", minOrder:150, emoji:"🍛", tags:["Popular","Spicy"], desc:"Slow-simmered curries, tandoor classics, and hand-rolled breads from the North Indian highway dhabas." },
  { id:2, name:"Bella Napoli", cuisine:"Italian", rating:4.7, priceRange:3, deliveryTime:"30-40 min", minOrder:200, emoji:"🍝", tags:["Chef's Pick"], desc:"Wood-fired pizzas and hand-rolled pastas, using a sourdough starter older than our chef." },
  { id:3, name:"Green Bowl Cafe", cuisine:"Healthy", rating:4.3, priceRange:2, deliveryTime:"20-30 min", minOrder:120, emoji:"🥗", tags:["Vegan Friendly","New"], desc:"Grain bowls, cold-pressed juices and plant-forward plates for the health-conscious eater." },
  { id:4, name:"Dragon Wok", cuisine:"Chinese", rating:4.2, priceRange:2, deliveryTime:"25-35 min", minOrder:150, emoji:"🥡", tags:["Popular"], desc:"Wok-tossed noodles and dim sum, fired up on the hottest burners in town." },
  { id:5, name:"Taco Fiesta", cuisine:"Mexican", rating:4.6, priceRange:1, deliveryTime:"20-30 min", minOrder:100, emoji:"🌮", tags:["Budget","Spicy"], desc:"Street-style tacos, loaded nachos and a salsa bar we take very, very seriously." },
  { id:6, name:"Burger Barn", cuisine:"American", rating:4.4, priceRange:1, deliveryTime:"15-25 min", minOrder:100, emoji:"🍔", tags:["Fast","Popular"], desc:"Flame-grilled patties, hand-cut fries, and shakes thick enough to stand a spoon in." }
];

const CATEGORIES = [
  { name:"Indian", ic:"🍛" },
  { name:"Italian", ic:"🍝" },
  { name:"Healthy", ic:"🥗" },
  { name:"Chinese", ic:"🥡" },
  { name:"Mexican", ic:"🌮" },
  { name:"American", ic:"🍔" }
];

/* dietary: "Veg" | "Non-Veg" | "Vegan" | "Gluten-Free" */
const MENU_ITEMS = [
  // Spice Route Kitchen (1)
  { id:101, restaurantId:1, name:"Butter Chicken", desc:"Tandoor-roasted chicken simmered in a velvety tomato-butter gravy.", price:280, dietary:"Non-Veg", emoji:"🍗", spice:2, rating:4.7,
    ingredients:["Chicken thigh","Tomato","Butter","Cream","Kasuri methi","Garam masala"],
    nutrition:{calories:520, protein:"34g", carbs:"14g", fat:"36g"},
    reviews:[{user:"Ananya",rating:5,comment:"Tastes just like my grandmother's recipe. Incredible."},{user:"Rohit",rating:4,comment:"Rich and creamy, a touch sweet for me but still great."}] },
  { id:102, restaurantId:1, name:"Paneer Tikka Masala", desc:"Chargrilled cottage cheese cubes in a smoky onion-tomato masala.", price:240, dietary:"Veg", emoji:"🧀", spice:2, rating:4.5,
    ingredients:["Paneer","Bell pepper","Onion","Tomato","Yogurt marinade"],
    nutrition:{calories:410, protein:"18g", carbs:"20g", fat:"27g"},
    reviews:[{user:"Meera",rating:5,comment:"Smoky flavor is unreal, best paneer dish I've had delivered."}] },
  { id:103, restaurantId:1, name:"Dal Makhani", desc:"Black lentils slow-cooked overnight with cream and a hint of smoke.", price:190, dietary:"Veg", emoji:"🍲", spice:1, rating:4.6,
    ingredients:["Black lentils","Kidney beans","Cream","Butter","Tomato"],
    nutrition:{calories:380, protein:"14g", carbs:"38g", fat:"18g"},
    reviews:[{user:"Karan",rating:5,comment:"Silky and comforting. Order the garlic naan with it."}] },
  { id:104, restaurantId:1, name:"Vegetable Biryani", desc:"Fragrant basmati layered with saffron, fried onions and garden vegetables.", price:220, dietary:"Vegan", emoji:"🍚", spice:2, rating:4.3,
    ingredients:["Basmati rice","Mixed vegetables","Saffron","Fried onion","Whole spices"],
    nutrition:{calories:450, protein:"9g", carbs:"78g", fat:"11g"},
    reviews:[{user:"Divya",rating:4,comment:"Great aroma, wish it had a bit more spice."}] },
  { id:105, restaurantId:1, name:"Tandoori Roti (2 pc)", desc:"Stone-baked whole wheat flatbread, char-kissed and pillowy soft.", price:60, dietary:"Vegan", emoji:"🫓", spice:0, rating:4.4,
    ingredients:["Whole wheat flour","Water","Salt"],
    nutrition:{calories:180, protein:"6g", carbs:"34g", fat:"2g"},
    reviews:[{user:"Sanjay",rating:4,comment:"Fresh and soft, perfect with the dal makhani."}] },

  // Bella Napoli (2)
  { id:201, restaurantId:2, name:"Margherita Pizza", desc:"San Marzano tomato, fior di latte mozzarella, and torn basil on a 48-hour dough.", price:340, dietary:"Veg", emoji:"🍕", spice:0, rating:4.8,
    ingredients:["Pizza dough","San Marzano tomato","Mozzarella","Basil","Olive oil"],
    nutrition:{calories:640, protein:"24g", carbs:"78g", fat:"24g"},
    reviews:[{user:"Fatima",rating:5,comment:"Crust is perfectly chewy and charred. Feels authentic."}] },
  { id:202, restaurantId:2, name:"Spaghetti Carbonara", desc:"Guanciale, pecorino and a silky egg emulsion — no cream, just technique.", price:360, dietary:"Non-Veg", emoji:"🍝", spice:0, rating:4.6,
    ingredients:["Spaghetti","Guanciale","Egg yolk","Pecorino Romano","Black pepper"],
    nutrition:{calories:710, protein:"28g", carbs:"64g", fat:"38g"},
    reviews:[{user:"Leo",rating:5,comment:"No cream, all technique — exactly how carbonara should be."}] },
  { id:203, restaurantId:2, name:"Truffle Mushroom Risotto", desc:"Arborio rice, wild mushrooms, and a whisper of black truffle oil.", price:390, dietary:"Veg", emoji:"🍚", spice:0, rating:4.5,
    ingredients:["Arborio rice","Mixed mushrooms","Parmesan","Truffle oil","White wine"],
    nutrition:{calories:520, protein:"14g", carbs:"58g", fat:"22g"},
    reviews:[{user:"Priya",rating:4,comment:"Creamy and earthy, though a small portion for the price."}] },
  { id:204, restaurantId:2, name:"Caprese Salad", desc:"Heirloom tomatoes, buffalo mozzarella and basil, dressed in aged balsamic.", price:260, dietary:"Gluten-Free", emoji:"🍅", spice:0, rating:4.4,
    ingredients:["Buffalo mozzarella","Heirloom tomato","Basil","Balsamic glaze"],
    nutrition:{calories:320, protein:"16g", carbs:"12g", fat:"22g"},
    reviews:[{user:"Ines",rating:4,comment:"Light, fresh, tastes like summer."}] },
  { id:205, restaurantId:2, name:"Tiramisu", desc:"Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.", price:210, dietary:"Veg", emoji:"🍰", spice:0, rating:4.9,
    ingredients:["Ladyfingers","Mascarpone","Espresso","Cocoa powder","Egg"],
    nutrition:{calories:390, protein:"7g", carbs:"36g", fat:"22g"},
    reviews:[{user:"Zainab",rating:5,comment:"Best tiramisu I've had outside Italy, no exaggeration."}] },

  // Green Bowl Cafe (3)
  { id:301, restaurantId:3, name:"Quinoa Buddha Bowl", desc:"Quinoa, roasted chickpeas, avocado and tahini drizzle in one balanced bowl.", price:230, dietary:"Vegan", emoji:"🥙", spice:0, rating:4.4,
    ingredients:["Quinoa","Chickpeas","Avocado","Kale","Tahini dressing"],
    nutrition:{calories:480, protein:"16g", carbs:"52g", fat:"20g"},
    reviews:[{user:"Nisha",rating:5,comment:"Filling but light, my go-to lunch order."}] },
  { id:302, restaurantId:3, name:"Grilled Tofu Salad", desc:"Charred tofu, mixed greens, cucumber and a citrus-ginger vinaigrette.", price:210, dietary:"Vegan", emoji:"🥗", spice:0, rating:4.2,
    ingredients:["Tofu","Mixed greens","Cucumber","Carrot","Citrus dressing"],
    nutrition:{calories:310, protein:"18g", carbs:"22g", fat:"14g"},
    reviews:[{user:"Arjun",rating:4,comment:"Dressing is bright and zippy, tofu nicely charred."}] },
  { id:303, restaurantId:3, name:"Grilled Salmon Bowl", desc:"Pan-seared salmon over brown rice with steamed greens and sesame.", price:340, dietary:"Gluten-Free", emoji:"🐟", spice:0, rating:4.6,
    ingredients:["Salmon fillet","Brown rice","Broccoli","Sesame seeds","Soy glaze"],
    nutrition:{calories:520, protein:"36g", carbs:"40g", fat:"22g"},
    reviews:[{user:"Wei",rating:5,comment:"Perfectly cooked salmon, still moist in the middle."}] },
  { id:304, restaurantId:3, name:"Cold-Pressed Green Juice", desc:"Spinach, cucumber, green apple, celery and a squeeze of lime.", price:120, dietary:"Vegan", emoji:"🥤", spice:0, rating:4.3,
    ingredients:["Spinach","Cucumber","Green apple","Celery","Lime"],
    nutrition:{calories:110, protein:"2g", carbs:"26g", fat:"0g"},
    reviews:[{user:"Farah",rating:4,comment:"Refreshing, not overly sweet."}] },
  { id:305, restaurantId:3, name:"Overnight Oats Cup", desc:"Rolled oats soaked in almond milk with berries, chia and honey.", price:150, dietary:"Veg", emoji:"🥣", spice:0, rating:4.5,
    ingredients:["Rolled oats","Almond milk","Mixed berries","Chia seeds","Honey"],
    nutrition:{calories:340, protein:"9g", carbs:"56g", fat:"9g"},
    reviews:[{user:"Tom",rating:5,comment:"Great grab-and-go breakfast, not too sweet."}] },

  // Dragon Wok (4)
  { id:401, restaurantId:4, name:"Kung Pao Chicken", desc:"Wok-seared chicken, peanuts and dried chilies in a tangy Sichuan glaze.", price:260, dietary:"Non-Veg", emoji:"🍗", spice:3, rating:4.5,
    ingredients:["Chicken breast","Peanuts","Dried chili","Sichuan peppercorn","Scallion"],
    nutrition:{calories:480, protein:"30g", carbs:"22g", fat:"28g"},
    reviews:[{user:"Ben",rating:5,comment:"Real numbing heat, exactly like the Chengdu original."}] },
  { id:402, restaurantId:4, name:"Vegetable Hakka Noodles", desc:"Wok-tossed noodles with julienned vegetables and soy-garlic glaze.", price:190, dietary:"Vegan", emoji:"🍜", spice:1, rating:4.2,
    ingredients:["Noodles","Cabbage","Carrot","Bell pepper","Soy sauce"],
    nutrition:{calories:420, protein:"11g", carbs:"64g", fat:"14g"},
    reviews:[{user:"Ritu",rating:4,comment:"Good smoky wok flavor, portion is generous."}] },
  { id:403, restaurantId:4, name:"Steamed Veg Dumplings (6pc)", desc:"Delicate wrappers filled with cabbage, mushroom and ginger.", price:170, dietary:"Vegan", emoji:"🥟", spice:0, rating:4.4,
    ingredients:["Wonton wrapper","Cabbage","Mushroom","Ginger","Sesame oil"],
    nutrition:{calories:260, protein:"7g", carbs:"38g", fat:"8g"},
    reviews:[{user:"Ken",rating:4,comment:"Light and fresh, dip in the chili oil that comes with it."}] },
  { id:404, restaurantId:4, name:"Sweet & Sour Pork", desc:"Crispy pork tossed in a glossy pineapple-tomato glaze.", price:270, dietary:"Non-Veg", emoji:"🍖", spice:0, rating:4.1,
    ingredients:["Pork","Pineapple","Bell pepper","Tomato ketchup","Vinegar"],
    nutrition:{calories:560, protein:"26g", carbs:"48g", fat:"28g"},
    reviews:[{user:"Alina",rating:4,comment:"Nicely balanced, not overly sweet like some versions."}] },
  { id:405, restaurantId:4, name:"Spring Rolls (4pc)", desc:"Crisp fried rolls stuffed with cabbage and glass noodles.", price:140, dietary:"Vegan", emoji:"🌯", spice:0, rating:4.3,
    ingredients:["Spring roll wrapper","Cabbage","Glass noodles","Carrot"],
    nutrition:{calories:300, protein:"5g", carbs:"36g", fat:"14g"},
    reviews:[{user:"Josh",rating:4,comment:"Crunchy exterior, good with the sweet chili dip."}] },

  // Taco Fiesta (5)
  { id:501, restaurantId:5, name:"Carne Asada Tacos (3pc)", desc:"Grilled marinated steak, onion, cilantro and salsa verde on corn tortillas.", price:220, dietary:"Non-Veg", emoji:"🌮", spice:2, rating:4.7,
    ingredients:["Skirt steak","Corn tortilla","Onion","Cilantro","Salsa verde"],
    nutrition:{calories:460, protein:"28g", carbs:"30g", fat:"22g"},
    reviews:[{user:"Marco",rating:5,comment:"Char on the steak is spot on, tastes like street tacos."}] },
  { id:502, restaurantId:5, name:"Loaded Nachos", desc:"Crisp tortilla chips piled with cheese, jalapeño, beans and pico de gallo.", price:250, dietary:"Veg", emoji:"🧀", spice:2, rating:4.5,
    ingredients:["Tortilla chips","Cheddar","Black beans","Jalapeño","Pico de gallo"],
    nutrition:{calories:680, protein:"20g", carbs:"58g", fat:"38g"},
    reviews:[{user:"Sara",rating:5,comment:"Shareable but I never actually share it."}] },
  { id:503, restaurantId:5, name:"Veggie Burrito Bowl", desc:"Cilantro-lime rice, black beans, corn salsa and guacamole.", price:210, dietary:"Vegan", emoji:"🥙", spice:1, rating:4.3,
    ingredients:["Rice","Black beans","Corn","Guacamole","Pico de gallo"],
    nutrition:{calories:520, protein:"14g", carbs:"70g", fat:"18g"},
    reviews:[{user:"Devika",rating:4,comment:"Hearty and fresh, good value for the size."}] },
  { id:504, restaurantId:5, name:"Chicken Quesadilla", desc:"Grilled tortilla folded over melted cheese and spiced chicken.", price:230, dietary:"Non-Veg", emoji:"🫓", spice:1, rating:4.4,
    ingredients:["Flour tortilla","Chicken","Cheddar","Onion","Peppers"],
    nutrition:{calories:590, protein:"32g", carbs:"42g", fat:"30g"},
    reviews:[{user:"Alex",rating:4,comment:"Crispy outside, gooey inside, exactly what I wanted."}] },
  { id:505, restaurantId:5, name:"Churros with Chocolate", desc:"Cinnamon-sugar churros with warm dark chocolate dip.", price:150, dietary:"Veg", emoji:"🍩", spice:0, rating:4.8,
    ingredients:["Choux pastry","Cinnamon sugar","Dark chocolate"],
    nutrition:{calories:410, protein:"5g", carbs:"52g", fat:"20g"},
    reviews:[{user:"Nadia",rating:5,comment:"Crispy outside, soft inside, the chocolate dip seals it."}] },

  // Burger Barn (6)
  { id:601, restaurantId:6, name:"Classic Cheeseburger", desc:"Flame-grilled beef patty, cheddar, pickles and house sauce on a brioche bun.", price:210, dietary:"Non-Veg", emoji:"🍔", spice:0, rating:4.5,
    ingredients:["Beef patty","Cheddar","Brioche bun","Pickles","House sauce"],
    nutrition:{calories:640, protein:"32g", carbs:"38g", fat:"38g"},
    reviews:[{user:"Dan",rating:5,comment:"Juicy patty, bun doesn't fall apart. Great burger."}] },
  { id:602, restaurantId:6, name:"Crispy Veg Burger", desc:"Crunchy potato-corn patty with lettuce, tomato and chipotle mayo.", price:170, dietary:"Veg", emoji:"🍔", spice:1, rating:4.2,
    ingredients:["Potato-corn patty","Lettuce","Tomato","Chipotle mayo","Bun"],
    nutrition:{calories:520, protein:"12g", carbs:"58g", fat:"24g"},
    reviews:[{user:"Priyanka",rating:4,comment:"Patty holds together well, good crunch."}] },
  { id:603, restaurantId:6, name:"Loaded Fries", desc:"Hand-cut fries topped with cheese sauce, bacon bits and scallions.", price:190, dietary:"Non-Veg", emoji:"🍟", spice:0, rating:4.6,
    ingredients:["Potato","Cheese sauce","Bacon","Scallion"],
    nutrition:{calories:610, protein:"14g", carbs:"56g", fat:"36g"},
    reviews:[{user:"Ollie",rating:5,comment:"Dangerous amount of cheese sauce, in the best way."}] },
  { id:604, restaurantId:6, name:"Grilled Chicken Sandwich", desc:"Buttermilk-marinated grilled chicken breast with slaw and garlic aioli.", price:230, dietary:"Non-Veg", emoji:"🥪", spice:0, rating:4.4,
    ingredients:["Chicken breast","Slaw","Garlic aioli","Brioche bun"],
    nutrition:{calories:560, protein:"38g", carbs:"40g", fat:"24g"},
    reviews:[{user:"Grace",rating:4,comment:"Chicken stays juicy, slaw adds nice crunch."}] },
  { id:605, restaurantId:6, name:"Chocolate Milkshake", desc:"Thick hand-spun shake made with real cocoa and vanilla bean ice cream.", price:150, dietary:"Veg", emoji:"🥤", spice:0, rating:4.7,
    ingredients:["Vanilla ice cream","Cocoa","Milk","Whipped cream"],
    nutrition:{calories:480, protein:"9g", carbs:"58g", fat:"22g"},
    reviews:[{user:"Mia",rating:5,comment:"Thick enough to need a spoon first, exactly right."}] }
];

const COUPONS = [
  { code:"WELCOME10", discount:0.10, desc:"10% off your first order", minOrder:0 },
  { code:"FRESH20", discount:0.20, desc:"20% off orders above ₹500", minOrder:500 },
  { code:"FREESHIP", discount:0, freeDelivery:true, desc:"Free delivery on any order", minOrder:0 }
];

const DELIVERY_SLOTS = ["As soon as possible (30-40 min)","Today, 6:00 PM - 6:30 PM","Today, 7:00 PM - 7:30 PM","Today, 8:00 PM - 8:30 PM","Tomorrow, 12:00 PM - 12:30 PM"];

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

function getRestaurant(id){ return RESTAURANTS.find(r=>r.id===Number(id)); }
function getMenuItem(id){ return MENU_ITEMS.find(m=>m.id===Number(id)); }
function getMenuByRestaurant(id){ return MENU_ITEMS.filter(m=>m.restaurantId===Number(id)); }
