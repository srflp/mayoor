import { PrismaClient } from "@prisma/client";

import data from "./data2.json";

const prisma = new PrismaClient();

async function seed() {
  await prisma.order.deleteMany({})
  await prisma.material.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.customer.deleteMany({})
  await prisma.productionLog.deleteMany({})
  await prisma.user.deleteMany({})


  const createdAdminUser = await prisma.user.create({
    data: {
      email: "admin",
      password: "$2b$10$LwzufdvFedsTXeHz122DxuqKv/X6GEs48dtErdW1FD0V0I/ZwUrKe", // decoded password: admin
      role: "EXECUTIVE", // highest permission role
      name: "John Doe",
      canBeEdited: false,
    },
  });

  await Promise.all(
    data.users.map(
      async (user, i) => {
        await prisma.user.create({
          // @ts-expect-error
          data: user,
        });
      }
    )
  )

  await Promise.all(
    data.materials.map(async (material, i) => {
      await prisma.material.create({
        data: {
          name: material.name,
          price: material.price,
          createdBy: {
            connect: {
              id: createdAdminUser.id,
            },
          },
        },
      });
    })
  );
  
  const material = await prisma.material.create({
    data: {
      name: "Banner 510",
      price: 150,
      createdBy: {
        connect: {
          id: createdAdminUser.id,
        },
      },
    },
  });


  await Promise.all(
    data.orders.map(async (order, i) => {
      await prisma.order.create({
        data: {
          number: order.number,
          totalPrice: order.totalPrice,
          totalTax: order.totalTax,
          // @ts-expect-error
          status: order.status,
          createdBy: {
            connect: {
              id: createdAdminUser.id,
            },
          },
          customer: {
            create: {
              name: order.customer.name,
              identificationNumber: order.customer.identificationNumber,
              personName: order.customer.personName,
              createdBy: {
                connect: { id: createdAdminUser.id },
              },
            },
          },
          items: {
            create: {
              material: {
                connect: {
                  id: material.id,
                },
              },
              width: order.items.width,
              height: order.items.height,
              totalTax: order.items.totalTax,
              totalPrice: order.items.totalPrice,
              createdBy: {
                connect: { id: createdAdminUser.id },
              },
            },
          },
        },
      });
    })
  );


 




  // await Promise.all(
  //   ["John Black", "Jane Blue", "Robert Gillbert"].map(
  //     async (personName, i) => {
  //       await prisma.order.create({
  //         data: {
  //           number: i + 1,
  //           totalPrice: 890,
  //           totalTax: 120,
  //           status: "NEW",
  //           createdBy: {
  //             connect: {
  //               id: createdAdminUser.id,
  //             },
  //           },
  //           customer: {
  //             create: {
  //               name: "Company Inc.",
  //               identificationNumber: "1567984511",
  //               personName,
  //               createdBy: {
  //                 connect: { id: createdAdminUser.id },
  //               },
  //             },
  //           },
  //           items: {
  //             create: {
  //               material: {
  //                 connect: {
  //                   id: material.id,
  //                 },
  //               },
  //               width: 3,
  //               height: 1.5,
  //               totalTax: 50,
  //               totalPrice: 150,
  //               createdBy: {
  //                 connect: { id: createdAdminUser.id },
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   )
  // );

  console.log("Prisma seed - Created EXECUTIVE user (all permissions)");
  console.log(createdAdminUser);
}

seed();
