UPDATE Monster
SET Exp = ROUND(10* (HP * (1.0 + (AC + MAC) / 100.0 + (DC + DCMAX)/100.0 + (MC +SC) /100.0)));