# -*- coding: utf-8 -*-
from config import EXCEL_DIRECTORY
from xlsxwriter.workbook import Workbook
import os


def generate_xlsx(student_ids, student_names, links, lesson_name, assignment_name):
    length = len(student_names)
    name = lesson_name + '_' + assignment_name + '.xlsx'
    workbook = Workbook(os.path.join(EXCEL_DIRECTORY, name))
    worksheet = workbook.add_worksheet(assignment_name)
    for i in xrange(0, length):
        worksheet.write(i, 0, student_ids[i])
        worksheet.write(i, 1, student_names[i])
        worksheet.write(i, 2, links[i])
    workbook.close()
    return name
