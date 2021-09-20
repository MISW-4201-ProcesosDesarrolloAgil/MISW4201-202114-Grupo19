import unittest
from flaskr.vistas.vistas import VistaCanciones
from flaskr.modelos.modelos import *
from flaskr import create_app
from flaskr.app import app
import code
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


class TestCancionGenero(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['DEBUG'] = True
        app.config['APP_ENV'] = 'APP_ENV_TESTING'
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()
        db.create_all()

    def test_post_canciones_positive(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        request = self.client.post("/canciones", json=new_cancion)
        code = request.status_code
        response = request.get_json()
        self.assertEqual(code, 200)

    def test_post_canciones_negative(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
        }
        self.assertRaises(Exception, self.client.post, ["/canciones", new_cancion])

    def test_get_canciones_positive(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        new_cancion = Cancion(**new_cancion)
        db.session.add(new_cancion)
        db.session.commit()
        request = self.client.get("/canciones")
        code = request.status_code
        response = request.get_json()
        self.assertEqual(code, 200)
        self.assertIsInstance(response, list)

    def test_get_generos_positive(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        new_cancion = Cancion(**new_cancion)
        db.session.add(new_cancion)
        db.session.commit()
        request = self.client.get("/generos")
        code = request.status_code
        response = request.get_json()
        self.assertEqual(code, 200)
        self.assertIsInstance(response, list)

    def test_get_cancion_positive(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        new_cancion = Cancion(**new_cancion)
        db.session.add(new_cancion)
        db.session.commit()
        request = self.client.get("/cancion/1")
        code = request.status_code
        response = request.get_json()
        self.assertEqual(code, 200)
        self.assertIsInstance(response, dict)

    def test_get_cancion_negative(self):
        request = self.client.get("/cancion/1000")
        code = request.status_code
        self.assertEqual(code, 404)

    def test_delete_cancion_positive(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        new_cancion = Cancion(**new_cancion)
        db.session.add(new_cancion)
        db.session.commit()
        request = self.client.delete("/cancion/1")
        code = request.status_code
        self.assertEqual(code, 204)

    def test_delete_cancion_negative(self):
        request = self.client.get("/cancion/1000")
        code = request.status_code
        self.assertEqual(code, 404)

    def test_put_cancion_positive(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur ",
            "genero": "pop"
        }
        new_cancion = Cancion(**new_cancion)
        db.session.add(new_cancion)
        db.session.commit()
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        request = self.client.put("/cancion/1", json=new_cancion)
        code = request.status_code
        response = request.get_json()
        self.assertEqual(code, 200)
        self.assertEqual(response.get("interprete"), new_cancion.get("interprete"))

    def test_put_cancion_negative(self):
        new_cancion = {
            "titulo": "francis",
            "minutos": 2,
            "segundos": 50,
            "interprete": "coeur de pirate",
            "genero": "pop"
        }
        request = self.client.put("/cancion/1000", json=new_cancion)
        code = request.status_code
        self.assertEqual(code, 404)

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
