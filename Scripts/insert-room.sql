-- PLANTA BAJA (solo reserva el equipo directivo)

INSERT INTO ROOM VALUES(1, 'Administración', 3, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(2, 'Jefe de proyectos', 1, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(3, 'Conserjería', 1, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(4, 'Entrada', 1, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(5, 'Dirección', 1, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(6, 'Secretaría', 1, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(7, 'Jefe de Estudios', 2, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(8, 'Tep', 1, 0, 2, 1, '1', 3, "12345678F");
INSERT INTO ROOM VALUES(9, 'Salón de actos', 1, 0, 1, 1, '1,2', 2, "12345678F"); -- (tambien reservan los jefes de departamento)

-- PRIMERA PLANTA

INSERT INTO ROOM VALUES(10, 'Sala de profesores 1', 22, 1, 2, 1, '1,2,3', 1, "12345678F");
INSERT INTO ROOM VALUES(11, 'Sala de profesores 2', 25, 1, 3, 1, '1,2,3', 1, "12345678F"); -- (se puede reservar entera o por puestos)
INSERT INTO ROOM VALUES(12, 'Sala de café', 1, 1, 2, 1, '1,2,3', 1, "12345678F");
INSERT INTO ROOM VALUES(13, 'Aula 1', 40, 1, 1, 1, '1,2,3', 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES(14, 'Aula 2', 21, 1, 1, 1, '1,2,3', 2, "12345678F"); -- (entera)

-- SEGUNDA PLANTA

INSERT INTO ROOM VALUES(15, 'Aula 3', 30, 2, 1, 1, '1,2,3', 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES(16, 'Aula 4', 3, 2, 2, 1, '1,2,3', 2, "12345678F");
INSERT INTO ROOM VALUES(17, 'Aula 5', 27, 2, 1, 1, '1,2,3', 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES(18, 'Aula 6', 22, 2, 1, 1, '1,2,3', 2, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES(19, 'Sala de reuniones', 14, 2, 1, 1, '1,2,3', 1, "12345678F"); -- (entera)
INSERT INTO ROOM VALUES(20, 'Aula 7', 24, 2, 1, 1, '1,2,3', 2, "12345678F"); -- (entera)
