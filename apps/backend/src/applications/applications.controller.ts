import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Res,
  ClassSerializerInterceptor
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'

import { UpdateApplicationDto } from './application.dto'
import { ApplicationsService } from './applications.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST)
    }

    try {
      const application = await this.applicationsService.create(file)
      return {
        message: 'Application téléversée avec succès',
        application
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors du téléversement',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get()
  async findAll() {
    return this.applicationsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const application = await this.applicationsService.findOne(id)
    if (!application) {
      throw new HttpException('Application non trouvée', HttpStatus.NOT_FOUND)
    }

    return application
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const application = await this.applicationsService.findOne(id)
    if (!application) {
      throw new HttpException('Application non trouvée', HttpStatus.NOT_FOUND)
    }

    return res.download(application.filePath, application.filename, (err) => {
      if (err) {
        // Check if headers are already sent to prevent "Cannot set headers after they are sent to the client"
        if (!res.headersSent) {
          res.status(404).json({ message: 'Fichier introuvable sur le disque' })
        }
      }
    })
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateApplicationDto
  ) {
    const application = await this.applicationsService.update(id, updateData)
    if (!application) {
      throw new HttpException('Application non trouvée', HttpStatus.NOT_FOUND)
    }
    return application
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.applicationsService.delete(id)
    return { message: 'Application supprimée avec succès' }
  }
}
