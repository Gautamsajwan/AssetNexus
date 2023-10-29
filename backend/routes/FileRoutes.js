import express from 'express'
import BrandModel from '../models/BrandModel.js'
import upload from '../middlewares/multer.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import Image from '../models/ImageModel.js'
import Video from '../models/VideoModel.js'
import Music from '../models/MusicModel.js'
import Application from '../models/DocsModel.js'
import fetchUser from '../middlewares/JWT.js'

const router = express.Router()

router.post('/upload', upload.single('asset'), async (req, res) => {
    try {
        console.log("body=>", req.body)
        console.log("file=>", req.file)
        const schemaMapping = {
            'image': Image,
            'video': Video,
            'audio': Music,
            'application': Application
        };

        const { originalname, mimetype, size, path } = req.file
        const { brandName, description } = req.body

        const fileType = mimetype.split('/')[0];
        let SchemaToUse = schemaMapping[fileType];

        let folderName = ""
        if (fileType === 'image')
            folderName = 'images'
        else if (fileType === 'audio')
            folderName = 'audios'
        else if (fileType === 'video')
            folderName = 'videos'
        else
            folderName = 'docs'

        const options = {
            resource_type: "auto",
            allowed_formats: [
                "jpg", "jpeg", "png", "gif",  // Images
                "mp4", "avi", "mov", "mkv",   // Videos
                "mp3", "wav", "ogg", "aac",   // Audio
                "pdf", "doc", "docx", "txt"   // Documents
            ],
            folder: folderName,
            categorization: 'google_tagging',
            auto_tagging: .6
        }

        const result = await cloudinary.uploader.upload(req.file.path, options)
        console.log("result => ", result)
        if (!result.secure_url) {
            res.status(500).json({
                success: false,
                msg: 'Error uploading file to Cloudinary'
            });
            return;
        }

        const assetURL = result.secure_url
        const assetPublicId = result.public_id
        const tags = result.tags

        let SearchBrand = await BrandModel.findOne({ brandName });
        let InsertAsset = null;

        let category = fileType[0].toUpperCase() + fileType.slice(1);
        if (category === 'Audio')
            category = 'Music'

        InsertAsset = await SchemaToUse.create({
            fileName: originalname,
            fileType: mimetype,
            fileSize: size,
            uploadTimeStamp: new Date(),
            storageLocation: path,
            tags: tags,
            description: description,
            assetURL: assetURL,
            assetPublicId: assetPublicId
        });

        if (!SearchBrand) { // if no brand was found with the received name by api then create one
            SearchBrand = await BrandModel.create({ brandName: brandName, [category]: [InsertAsset._id] });
            SearchBrand = await BrandModel.findById(SearchBrand._id).populate(`${category}`);
        } else {
            SearchBrand = await BrandModel.findOneAndUpdate({ brandName: brandName }, { $push: { [category]: InsertAsset._id } }).populate(`${category}`);
        }

        fs.unlinkSync(path)

        res.status(200).json({
            success: true,
            msg: "asset uploaded successfully",
            latestAsset: InsertAsset
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "internal server error"
        })
    }
})

router.post('/multiple', upload.array('assets'), async (req, res) => {
    console.log("body=>", req.body)
    console.log("files=>", req.files)

    const { brandName, description } = req.body
    const assets = req.files
    let SearchBrand = null

    try {
        const promises = assets.map(async (file) => {
            const schemaMapping = {
                'image': Image,
                'video': Video,
                'audio': Music,
                'application': Application
            };

            const { originalname, mimetype, size, path } = file

            const fileType = mimetype.split('/')[0];
            let SchemaToUse = schemaMapping[fileType];

            let folderName = ""
            if (fileType === 'image')
                folderName = 'images'
            else if (fileType === 'audio')
                folderName = 'audios'
            else if (fileType === 'video')
                folderName = 'videos'
            else
                folderName = 'docs'

            const options = {
                resource_type: "auto",
                allowed_formats: [
                    "jpg", "jpeg", "png", "gif",  // Images
                    "mp4", "avi", "mov", "mkv",   // Videos
                    "mp3", "wav", "ogg", "aac",   // Audio
                    "pdf", "doc", "docx", "txt"   // Documents
                ],
                folder: folderName,
                categorization: 'google_tagging',
                auto_tagging: .6
            }

            const result = await cloudinary.uploader.upload(path, options)
            if (!result.secure_url) {
                res.status(500).send('Error uploading file to Cloudinary');
                return;
            }

            const assetURL = result.secure_url
            const assetPublicId = result.public_id
            const tags = result.tags

            SearchBrand = await BrandModel.findOne({ brandName })
            let InsertAsset = null;

            let category = fileType[0].toUpperCase() + fileType.slice(1);
            if (category === 'Audio')
                category = 'Music'

            InsertAsset = await SchemaToUse.create({
                fileName: originalname,
                fileType: mimetype,
                fileSize: size,
                uploadTimeStamp: new Date(),
                storageLocation: path,
                tags: tags,
                description: description,
                assetURL: assetURL,
                assetPublicId: assetPublicId
            });

            if (!SearchBrand) { // if no brand was found with the received name by api then create one
                SearchBrand = await BrandModel.create({ brandName: brandName, [category]: [InsertAsset._id] });
                SearchBrand = await BrandModel.findById(SearchBrand._id).populate(`${category}`);
            } else {
                SearchBrand = await BrandModel.findOneAndUpdate({ brandName: brandName }, { $push: { [category]: InsertAsset._id } }).populate(`${category}`);
            }

            fs.unlinkSync(path)
        })

        const result = await Promise.all(promises)
        res.status(200).json({
            success: true,
            msg: "asset uploaded successfully",
            brand: SearchBrand
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "internal server error"
        })
    }
})

router.get('/assets/images', fetchUser, async (req, res) => {
    console.log("Image fetch request")
    try {
        const { brandName } = req.query
        console.log("Brand name: " + brandName);

        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Image')

        if (!assets) {
            res.status(404).json({ error: "no assets found" })
            return
        }

        res.status(200).json({
            success: true,
            msg: 'assets fetched successfully',
            assets: assets.Image
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
    }
})

router.get('/assets/videos', fetchUser, async (req, res) => {
    try {
        const { brandName } = req.query

        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Video')

        if (!assets) {
            res.status(404).json({ error: "no assets found" })
            return
        }

        res.status(200).json({
            success: true,
            msg: 'assets fetched successfully',
            assets: assets.Video
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
    }
})

router.get('/assets/music', fetchUser, async (req, res) => {
    try {
        const { brandName } = req.query

        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Music')
        console.log("assets get =", assets)
        if (!assets) {
            res.status(404).json({ error: "no assets found" })
            return
        }

        res.status(200).json({
            success: true,
            msg: 'assets fetched successfully',
            assets: assets.Music
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
    }
})

router.get('/assets/docs', fetchUser, async (req, res) => {
    try {
        const { brandName } = req.query

        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Application')
        console.log(assets)
        if (!assets) {
            res.status(404).json({ error: "no assets found" })
            return
        }

        res.status(200).json({
            success: true,
            msg: 'assets fetched successfully',
            assets: assets.Application
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
    }
})

router.delete('/deleteOne/Image/:assetId', async (req, res) => {
    try {
        const assetId = req.params.assetId
        const { brandName } = req.body;
        const targetAsset = await Image.findById(assetId)

        if (!targetAsset) {
            res.status(404).json({
                success: false,
                msg: 'Asset not found'
            })
            return
        }

        const publicId = targetAsset.assetPublicId
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
        }

        await targetAsset.deleteOne() // asset deleted
        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Image')

        res.status(200).json({
            success: true,
            msg: 'Asset successfully deleted',
            updatedAssets: assets.Image
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})

router.delete('/deleteOne/Video/:assetId', async (req, res) => {
    try {
        const assetId = req.params.assetId
        const { brandName } = req.body;
        const targetAsset = await Video.findById(assetId)

        if (!targetAsset) {
            res.status(404).json({
                success: false,
                msg: 'Asset not found'
            })
            return
        }

        const publicId = targetAsset.assetPublicId
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
        }

        await targetAsset.deleteOne()

        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Video')

        res.status(200).json({
            success: true,
            msg: 'Asset successfully deleted',
            updatedAssets: assets.Video
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})

router.delete('/deleteOne/Music/:assetId', async (req, res) => {
    try {
        const assetId = req.params.assetId
        const { brandName } = req.body
        const targetAsset = await Music.findById(assetId)

        if (!targetAsset) {
            res.status(404).json({
                success: false,
                msg: 'Asset not found'
            })
            return
        }

        const publicId = targetAsset.assetPublicId
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
        }

        await targetAsset.deleteOne()

        const assets = await BrandModel.findOne({ brandName: brandName }).populate('Music')

        res.status(200).json({
            success: true,
            msg: 'Asset successfully deleted',
            updatedAssets: assets.Music
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})

router.delete('/deleteOne/Doc/:assetId', async (req, res) => {
    try {
        const assetId = req.params.assetId
        const { brandName } = req.body
        const targetAsset = await Application.findById(assetId)

        if (!targetAsset) {
            res.status(404).json({
                success: false,
                msg: 'Asset not found'
            })
            return
        }

        const publicId = targetAsset.assetPublicId
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
        }

        await targetAsset.deleteOne()
        const assets = await BrandModel.findOne({ userName: userName }).populate('Application')


        res.status(200).json({
            success: true,
            msg: 'Asset successfully deleted',
            updatedAssets: assets.Application
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})

router.get('/findOne/:assetId', async (req, res) => {
    try {
        const assetId = req.params.assetId
        const targetAsset = await Image.findById(assetId)

        if (!targetAsset) {
            res.status(404).send("Asset not found")
            return
        }

        res.status(200).json(targetAsset)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/updateImage/:assetId', upload.single('asset'), async (req, res) => {
    console.log("Update Route")
    console.log("body=>", req.body);
    console.log("file=>", req.file);
    try {
        const assetId = req.params.assetId
        const targetImage = await Image.findById(assetId)

        const publicId = targetImage.assetPublicId
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
        }

        const result = await cloudinary.uploader.upload(req.file.path)
        const assetURL = result.secure_url
        const assetPublicId = result.public_id
        const tags = result.tags

        const updatedImage = await Image.findByIdAndUpdate(assetId, {
            assetURL,
            assetPublicId,
            tags
        })

        fs.unlinkSync(req.file.path)

        if (updatedImage) {
            return (
                res.status(200).json({
                    success: true,
                    msg: 'asset updated successfully'
                })
            )
        }

        res.status(400).json({
            success: false,
            msg: 'cant update asset'
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            msg: 'internal server error'
        })
    }
})

// router.delete('/deleteAllAssets', async (req, res) => {
//     try {
//         await BrandModel.deleteMany({});
//         res.send("all assets deleted")
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ error: 'Internal server error' })
//     }
// })

router.post('/searchAssets/:search', async (req, res) => {
    try {
        const { brandName } = req.body
        const { search } = req.params;

        console.log("brandName", req.body)

        const Brand = await BrandModel.findOne({brandName: brandName})
        if(!Brand) {
            return res.status(404).json({
                success: false,
                msg: 'No match found'
            });
        }

        const assets = await Image.find({
            _id: { $in: Brand.Image },
            $or: [
                { tags: { $regex: search, $options: 'i' } }
            ]
        })

        if (assets.length == 0) {
            return res.status(400).json({
                success: false,
                msg: 'No match found'
            })
        }

        res.status(200).json({
            success: true,
            msg: 'search found',
            assets: assets
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
    }
})

export default router