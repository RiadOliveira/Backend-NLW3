import { getRepository } from 'typeorm'
import Orphanages from '../models/Orphanages'
import { Request, Response} from 'express'
import OrphanageView from '../views/Orphanagesview'
import * as yup from 'yup';

export default {

    async show(req:Request, res:Response) {

        const {id} = req.params

        const orphanagesRepository = getRepository(Orphanages);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return res.json(OrphanageView.render(orphanage))
    },

    async index(req:Request, res:Response) {
        const orphanagesRepository = getRepository(Orphanages);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return res.json(OrphanageView.renderMany(orphanages))
    },

    async create(req:Request, res:Response) {
        const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } = req.body

        const orphanagesRepository = getRepository(Orphanages);

        const requestImages = req.files as Express.Multer.File[];
        const images = requestImages.map((image) => {
            return { path: image.filename }
        })

        const data = {
            name, 
            latitude, 
            longitude, 
            about, 
            instructions, 
            opening_hours, 
            open_on_weekends: open_on_weekends === 'true',
            images
        }

        const schema = yup.object().shape({
            name: yup.string().required('Campo obrigatório'),
            latitude: yup.number().required(),
            longitude: yup.number().required(),
            about: yup.string().required().max(300),
            instructions: yup.string().required(),
            opening_hours: yup.string().required(),
            open_on_weekends: yup.boolean().required(),
            images: yup.array(yup.object().shape({
                path: yup.string().required()
            }))
        })

        await schema.validate(data, {
            abortEarly: false
        })

        const createOrphanage = orphanagesRepository.create(data)

        await orphanagesRepository.save(createOrphanage);

        return res.status(201).json(createOrphanage)
    }
}