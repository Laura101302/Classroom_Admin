-- PLANTA BAJA (solo reserva el equipo directivo)

INSERT INTO ROOM VALUES('', 'Administración', 3, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Jefe de proyectos', 1, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Conserjería', 1, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Entrada', 1, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Dirección', 1, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Secretaría', 1, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Jefe de Estudios', 2, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Tep', 1, 0, 2, 1, 3, "12345678F");
INSERT INTO ROOM VALUES('', 'Salón de actos', 1, 0, 2, 1, 2, "12345678F"); -- (tambien reservan los jefes de departamento)

-- PRIMERA PLANTA

INSERT INTO ROOM VALUES('', 'Sala de profesores 1', 22, 1, 2, 1, 1, "12345678F");
INSERT INTO ROOM VALUES('', 'Sala de café', 1, 1, 2, 1, 1, "12345678F");
INSERT INTO ROOM VALUES('', 'Sala de profesores 2', 25, 1, 3, 1, 1, "12345678F"); -- (se puede reservar entera o por puestos, checkbox?)
INSERT INTO ROOM VALUES('', 'Aula 1', 40, 1, 1, 1, 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES('', 'Aula 2', 21, 1, 1, 1, 2, "12345678F"); -- (entera)

-- SEGUNDA PLANTA

INSERT INTO ROOM VALUES('', 'Aula 3', 30, 2, 1, 1, 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES('', 'Aula 4', 3, 2, 2, 1, 2, "12345678F");
INSERT INTO ROOM VALUES('', 'Aula 5', 27, 2, 1, 1, 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES('', 'Aula 6', 22, 2, 1, 1, 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES('', 'Sala de reuniones', 14, 2, 1, 1, 1, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES('', 'Aula 7', 24, 2, 1, 1, 2, "12345678F"); -- (entera)
