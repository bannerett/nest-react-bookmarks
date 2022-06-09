import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { AppModule } from '../src/app.module'
import { AuthDto } from '../src/auth/dto'
import { PrismaService } from '../src/prisma/prisma.service'

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // security to remove unknown dto props
      }),
    )

    await app.init()
    await app.listen(1234)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:1234')
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const correctDto: AuthDto = { email: 'test@mail.com', password: '1234567' }
    const incorrectDtoEmail: AuthDto = { email: 'testmail.com', password: '1234567' }
    const incorrectDtoPass: AuthDto = { email: 'test@mail.com', password: '12345' }
    const incorrectDto: AuthDto = { email: 'test@mail.com', password: '12345' }

    describe('Signup', () => {
      it('Should NOT signup / incorrect email', () => {
        return pactum.spec().post('/auth/signup').withBody(incorrectDtoEmail).expectStatus(400)
      })
      it('Should NOT signup / incorrect pass', () => {
        return pactum.spec().post('/auth/signup').withBody(incorrectDtoPass).expectStatus(400)
      })
      it('Should NOT signup / incorrect all', () => {
        return pactum.spec().post('/auth/signup').withBody(incorrectDto).expectStatus(400)
      })
      it('Should signup', () => {
        return pactum.spec().post('/auth/signup').withBody(correctDto).expectStatus(201)
      })
    })

    describe('Login', () => {
      it('Should NOT login / incorrect email', () => {
        return pactum.spec().post(`/auth/login`).withBody(incorrectDtoEmail).expectStatus(400)
      })
      it('Should NOT login / incorrect pass', () => {
        return pactum.spec().post(`/auth/login`).withBody(incorrectDtoPass).expectStatus(400)
      })
      it('Should NOT login / incorrect all', () => {
        return pactum.spec().post(`/auth/login`).withBody(incorrectDtoPass).expectStatus(400)
      })
      it('Should login', () => {
        return pactum.spec().post(`/auth/login`).withBody(correctDto).expectStatus(200).stores('access_token', 'access_token')
      })
    })
  })

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me').withHeaders({ Authorization: `Bearer $S{access_token}` }).expectStatus(200)
      })
      it('Should return unauthorized', () => {
        return pactum.spec().get('/users/me').withHeaders({ Authorization: `Bearer jvjfjfhkkhvk` }).expectStatus(401)
      })
    })

    describe('Edit user', () => {})
  })

  describe('Bookmarks', () => {
    describe('Add bookmark', () => {})

    describe('Get bookmarks', () => {})

    describe('Get bookmark by id', () => {})
    describe('Edit bookmark', () => {})
    describe('Delete bookmark', () => {})
  })
  it.todo('Should pass')
})
