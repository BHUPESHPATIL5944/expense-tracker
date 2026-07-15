import {PrismaClient} from "@prisma/client";

const prisma =new PrismaClient();



export default prisma;

// Explanation:**

// This file cr

// **eates a single instance of `PrismaClient`, which is Prisma's database client. `PrismaClient` provides methods to perform database operations such as creating, reading, updating, and deleting records.

// Instead of creating a new database connection in every controller or route, I create one shared instance and export it. This follows the singleton pattern, which reduces unnecessary database connections, improves performance, and makes the code easier to maintain.

// Any file that needs database access can simply import this `prisma` instance and execute queries like:

// ```javascript
// const users = await prisma.user.findMany();
// ```

// or

// ```javascript
// const transaction = await prisma.transaction.create({
//   data: {
//     amount: 1000
//   }
// });
// ```
//This keeps database logic centralized and avoids creating multiple `PrismaClient` instances throughout the application.
