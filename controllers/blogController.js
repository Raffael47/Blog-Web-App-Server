const db = require('../models');
const { sequelize } = require('../models')
const blog = db.blog;
const keywordData = db.keyword;
const user = db.user;
const category = db.category
const blog_keyword = db.blog_keyword;
const { Op, Sequelize } = require('sequelize');
const liked_blog = db.liked_blog;

module.exports = {
    getBlog: async(req, res) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const search = req.query.search || "";
            const id_cat = req.query.id_cat || "";
            const sort = req.query.sort || "ASC";
            const author = req.query.author || "";
            
            const result = await blog.findAll({

                include: [
                    {
                        model: category,
                        attributes: ['name']
                    },
                    {
                        model: user,
                        attributes: ['username', 'imgProfile'],
                        where: {
                            username: {
                                [Op.like]: `${author}%`
                            }
                        }
                    },
                    {
                        model: keywordData,
                        attributes: ['keyword'],
                        through: {
                            attributes: []
                        }
                    },
                    {
                        model: liked_blog,
                        attributes: [
                            'userId'
                        ],
                        as: 'userLikes'
                    }
                ],
                
                limit,
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(liked_blogs.userId) 
                                FROM liked_blogs
                                WHERE blog.id = liked_blogs.blogId 
                                GROUP BY blogId
                            )`), 
                            'totalLikes'
                        ]
                    ]
                },
                offset: (page - 1) * limit,
                where: {
                    title: {
                        [Op.like]: `%${search}%`
                    },
                    categoryId: {
                        [Op.like]: `%${id_cat}%`
                    }
                },
                order: [
                    [Sequelize.col('createdAt'), `${ sort }` ]
                ]
            });

            res.status(200).send({
                status: true,
                page,
                limit,
                result
            });

        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },

    createBlog: async(req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { title, content, country, videoURL, keyword, categoryId } = req.body;
            const { filename, size } = req.file;
            
            if (size > 1000000) throw {
                message: 'File size is too large'
            };
            
            const result = await blog.create({
                title,
                content,
                country,
                imageURL: filename,
                videoURL,
                categoryId,
                userId: req.user.id
            }, { transaction });

            const array = keyword.split(';');
            for (const el of array) {
                const [key] = await keywordData.findOrCreate({ where: { keyword: el }, transaction })
                await blog_keyword.create({ blogId: result.id, keywordId: key.id}, { transaction })
            }

            await transaction.commit();

            res.status(201).send({
                status: true,
                message: 'Blog posted',
                result,
                keywords: array
            });

        } catch (err) {
            await transaction.rollback();
            res.status(400).send(err);
        };
    },

    deleteBlog: async(req, res) => {
        try {
            const { id } = req.params;

            await blog.destroy({
                where: {
                    [Op.and] : [
                        { id },
                        { userId: req.user.id }
                    ]
                }
            });

            res.status(200).send({
                status: true,
                message: 'Blog deleted'
            })
        } catch (err) {
            res.status(400).send(err);
        }
    },

    getMostLikedBlog: async(req, res) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const search = req.query.search || "";
            const id_cat = req.query.id_cat || "";
            
            const result = await blog.findAll({

                include: [
                    {
                        model: category,
                        attributes: ['name']
                    },
                    {
                        model: user,
                        attributes: ['username', 'imgProfile']
                    },
                    {
                        model: keywordData,
                        attributes: ['keyword'],
                        through: {
                            attributes: []
                        }
                    },
                    {
                        model: liked_blog,
                        attributes: [
                            'userId'
                        ],
                        as: 'userLikes'
                    }
                ],
                
                limit,
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(liked_blogs.userId) 
                                FROM liked_blogs
                                WHERE blog.id = liked_blogs.blogId 
                                GROUP BY blogId
                            )`), 
                            'totalLikes'
                        ]
                    ]
                },
                offset: (page - 1) * limit,
                where: {
                    title: {
                        [Op.like]: `%${search}%`
                    },
                    categoryId: {
                        [Op.like]: `%${id_cat}%`
                    }
                },
                order: [
                    [Sequelize.literal(`(
                        SELECT COUNT(liked_blogs.userId) 
                        FROM liked_blogs
                        WHERE blog.id = liked_blogs.blogId 
                        GROUP BY blogId
                    )`), 'DESC']
                ]
            });

            res.status(200).send({
                status: true,
                limit,
                page,
                result
            })
        } catch (err) {
            res.status(400).send(err);
        }
    },

    getCategory: async(req, res) => {
        try {
            const result = await category.findAll()

            res.status(200).send({
                status: true,
                result
            });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    getBlogById: async(req, res) => {
        try {
            const { id } = req.params;

            const result = await blog.findOne({
                include: [
                    {
                        model: category,
                        attributes: ['name']
                    },
                    {
                        model: user,
                        attributes: ['username', 'imgProfile']
                    },
                    {
                        model: liked_blog,
                        attributes: ['userId'],
                        as: 'userLikes'
                    }
                ],
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(liked_blogs.userId) 
                                FROM liked_blogs
                                WHERE blog.id = liked_blogs.blogId 
                                GROUP BY blogId
                            )`),
                            'totalLikes'
                        ]
                    ]
                },
                where: { id }
            })

            res.status(200).send({
                status: true,
                result
            })
        } catch (err) {
            res.status(400).send(err);
        }
    },

    getUserBlog: async(req, res) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const search = req.query.search || "";
            const id_cat = req.query.id_cat || "";
            const sort = req.query.sort || "ASC";
            
            const result = await blog.findAll({

                include: [
                    {
                        model: category,
                        attributes: ['name']
                    },
                    {
                        model: user,
                        attributes: ['username', 'imgProfile']
                    },
                    {
                        model: keywordData,
                        attributes: ['keyword'],
                        through: {
                            attributes: []
                        }
                    },
                    {
                        model: liked_blog,
                        attributes: [
                            'userId'
                        ],
                        as: 'userLikes'
                    }
                ],
                
                limit,
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(liked_blogs.userId) 
                                FROM liked_blogs
                                WHERE blog.id = liked_blogs.blogId 
                                GROUP BY blogId
                            )`), 
                            'totalLikes'
                        ]
                    ]
                },
                offset: (page - 1) * limit,
                where: {
                    userId: req.user.id,
                    title: {
                        [Op.like]: `%${search}%`
                    },
                    categoryId: {
                        [Op.like]: `%${id_cat}%`
                    }
                },
                order: [
                    [Sequelize.col('createdAt'), `${ sort }` ]
                ]
            });

            res.status(200).send({
                status: true,
                page,
                limit,
                result
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },

    likeBlog: async(req, res) => {
        try {
            const { blogId } = req.body;
            
            await liked_blog.findOrCreate({
                where: {
                    blogId,
                    userId: req.user.id
                }
            });

            res.status(201).send({
                status: true,
                message: 'Blog liked'
            });

        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    getLikedBlog: async(req, res) => {
        try {
            const search = req.query.search || "";
            const id_cat = req.query.id_cat || "";
            const sort = req.query.sort || "ASC";
            const author = req.query.author || "";

            const result = await liked_blog.findAll({
                include: [
                    {
                        model: blog,
                        include: [
                            {
                                model: category,
                                attributes: ['name']
                            },
                            {
                                model: user,
                                attributes: ['username', 'imgProfile'],
                                where: {
                                    username: {
                                        [Op.like]: `${author}%`
                                    }
                                }
                            },
                            {
                                model: keywordData,
                                attributes: ['keyword'],
                                through: {
                                    attributes: []
                                }
                            },
                            {
                                model: liked_blog,
                                attributes: [
                                    'userId'
                                ],
                                as: 'userLikes'
                            }
                        ],
                        attributes: {
                            include: [
                                [
                                    Sequelize.literal(`(
                                        SELECT COUNT(liked_blogs.userId) 
                                        FROM liked_blogs
                                        WHERE blog.id = liked_blogs.blogId 
                                        GROUP BY blogId
                                    )`), 
                                    'totalLikes'
                                ]
                            ]
                        },
                        where: {
                            title: {
                                [Op.like]: `%${search}%`
                            },
                            categoryId: {
                                [Op.like]: `%${id_cat}%`
                            }
                        },
                        order: [
                            [Sequelize.col('createdAt'), `${ sort }` ]
                        ]
                    },
                    { model: user, attributes: [] }
                ],
                where: {
                    userId: req.user.id
                },
                attributes: {
                    exclude: ['userId']
                }
            });

            res.status(200).send({
                status: true,
                result
            });

        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },

    unlikeBlog: async(req, res) => {
        try {
            const { blogId } = req.body;

            await liked_blog.destroy({
                where: {
                    blogId,
                    userId: req.user.id
                }
            });

            res.status(200).send({
                status: true,
                message: 'Blog unliked'
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }
}