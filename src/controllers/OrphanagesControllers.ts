import { getRepository } from 'typeorm'
import Orphanages from '../models/Orphanages'
import { Request, Response} from 'express'

export default {

    async show(req:Request, res:Response) {

        const {id} = req.params

        const orphanagesRepository = getRepository(Orphanages);

        const orphanage = await orphanagesRepository.findOneOrFail(id);

        return res.json(orphanage)
    },

    async index(req:Request, res:Response) {
        const orphanagesRepository = getRepository(Orphanages);

        const orphanages = await orphanagesRepository.find();

        return res.json(orphanages)
    },

    async create(req:Request, res:Response) {
        const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } = req.body

        const orphanagesRepository = getRepository(Orphanages);

        const requestImages = req.files as Express.Multer.File[];
        const images = 

        const createOrphanage = orphanagesRepository.create({
            name, 
            latitude, 
            longitude, 
            about, 
            instructions, 
            opening_hours, 
            open_on_weekends,
            images: 
        })

        await orphanagesRepository.save(createOrphanage);

        return res.status(201).json(createOrphanage)
    }
}