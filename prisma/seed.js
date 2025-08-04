import bcrypt from 'bcrypt';
import pkg from '@prisma/client';
const { PrismaClient, CaslAction } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 🔑 Hash password admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1️⃣ Roles
  const rolesData = [
    { name: 'Administrator', description: 'Full access to all system features' },
    { name: 'Manager', description: 'Manage teams and oversee operations' },
    { name: 'Team Leader', description: 'Lead a small team of members' },
  ];

  for (const role of rolesData) {
    await prisma.caslRole.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Ambil role IDs
  const adminRole = await prisma.caslRole.findUnique({ where: { name: 'Administrator' } });
  const managerRole = await prisma.caslRole.findUnique({ where: { name: 'Manager' } });
  const leaderRole = await prisma.caslRole.findUnique({ where: { name: 'Team Leader' } });

  // 2️⃣ Permissions bawaan
  const permissionsData = [
    // Admin → full control
    { action: CaslAction.MANAGE, subject: 'all', roleId: adminRole.id },

    // Manager → read & update semua
    { action: CaslAction.READ, subject: 'all', roleId: managerRole.id },
    { action: CaslAction.UPDATE, subject: 'all', roleId: managerRole.id },

    // Team Leader → read semua
    { action: CaslAction.READ, subject: 'all', roleId: leaderRole.id },
  ];

  for (const perm of permissionsData) {
    await prisma.caslPermission.upsert({
      where: {
        roleId_action_subject: {
          roleId: perm.roleId,
          action: perm.action,
          subject: perm.subject,
        },
      },
      update: {},
      create: perm,
    });
  }

  // 3️⃣ Admin user default
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator',
      username: 'administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Seeding completed.');
}

main()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
