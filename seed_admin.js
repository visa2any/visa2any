
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'visa2any@gmail.com';
    const password = 'ChangeMe123!'; // Strong initial password
    const name = 'Super Admin';

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`User with email ${email} already exists.`);
            // Optionally upgrade to ADMIN if not already
            if (existingUser.role !== 'ADMIN') {
                const updatedUser = await prisma.user.update({
                    where: { email },
                    data: { role: 'ADMIN' },
                });
                console.log(`Updated user ${email} to ADMIN role.`);
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'ADMIN',
                    isActive: true,
                },
            });
            console.log(`Created Super Admin user: ${newUser.email}`);
            console.log(`Initial Password: ${password}`);
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
