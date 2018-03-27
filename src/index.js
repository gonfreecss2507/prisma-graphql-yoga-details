// const { GraphQLServer } = require('graphql-yoga')

// let idCount = 0
// const posts = []

// const resolvers = {
//   Query: {
//     description: () => `This is the API for a simple blogging application`,
//     posts: () => posts,
//     post: (parent, args) => posts.find(post => post.id === args.id),
//   },
//   Mutation: {
//     createDraft: (parent, args) => {
//       const post = {
//         id: `post_${idCount++}`,
//         title: args.title,
//         content: args.content,
//         published: false,
//       }
//       posts.push(post)
//       return post
//     },
//     deletePost: (parent, args) => {
//       const postIndex = posts.findIndex(post => post.id === args.id)
//       if (postIndex > -1) {
//         const deleted = posts.splice(postIndex, 1)
//         return deleted[0]
//       }
//       return null
//     },
//     publish: (parent, args) => {
//       const postIndex = posts.findIndex(post => post.id === args.id)
//       posts[postIndex].published = true
//       return posts[postIndex]
//     },
//   },
// }

// // const resolvers = {
// //   Query: {
// //     description: () => 'Just description',
// //     posts: () => posts,
// //     post: (parent, args, context, info) => posts.find(post => post.id === args.id)
// //   },
// //   Mutation: {
// //     createDraft: (parent, args, context ,info) => {
// //       const post = {
// //         id: `post_${idCount++}`,
// //         title: args.title,
// //         content: args.content,
// //         published: false
// //       }
// //       posts.push(post)
// //       return post
// //     },
// //     deletePost: (parent, args, context, info) => {
// //       const postIndex = posts.findIndex(post => post.id === args.id)
// //       if(postIndex > -1){
// //         const deleted = post.splice(postIndex, 1)
// //         return delete[0]
// //       }
// //       return null
// //     },
// //     publish: (parent, args, context, info) => {
// //       const post_index = posts.findIndex(post => post.id === args.id)
// //       if(post_index > -1) {
// //         posts[post_index].published = true
// //         return posts[post_index]
// //       }
// //       return null
// //     }
// //   }
// // }




// const server = new GraphQLServer({
//   typeDefs : './schema.graphql',
//   resolvers
// })

// server.start(() => console.log(`The server is running on http://localhost:4000`))




// // Array  -> find(callback)
// //        -> push
// //        -> splice
// //        -> remove element: findIndex, splice
// //        -> 

// // graphql-yoga cung cap luon graphtools editor khi start server, graphql-imports(import file graphql using comment)
// // graphql-yoga: da co the query API, playground ..., port: 4000
// // Prisma: ket noi voi API cua graphql-yoga, connect vao DB, tao. model trong DB: folder(database/datamodel.graphql: tao DB vao mysql, cu phap khac voi prisma.graphql, prisma.yml: configure)
// //        : generated/prisma.graphql: 
// //        : port 4466

// //nodemon index.js different nodemon  src/index.js
// // path typedefs in 2 case is different






const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      return ctx.db.query.posts({ }, info)
    },
    post(parent, args, ctx, info) {
      return ctx.db.query.post({ where: { id: args.id } }, info)
    },
  },

  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text,
          },
        },
        info,
      )
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id } }, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the generated Prisma DB schema
      endpoint: '__PRISMA_ENDPOINT__',          // the endpoint of the Prisma DB service
      secret: 'mysecret123',                    // specified in database/prisma.yml
      debug: true,                              // log all GraphQL queries & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))