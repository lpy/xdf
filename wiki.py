import api
import model


def make_api_page(fd, func_list):
    for func in func_list:
        fd.write(func.func_doc)


def make_model_page(fd, model):
    fd.write(model.__doc__)

wiki_api = {
    'API-Answer': [
        api.answer.get_answer
    ],
    'API-Assignment': [
        api.assignment.get_assignment,
        api.assignment.answer_assignment
    ],
    'API-Dashboard': [

    ],
    'API-Question': [

    ],
    'API-Student': [

    ]
}
wiki_model = {
    'Model-Answer': model.answer.Answer,
    'Model-Assignment': model.assignment.Assignment,
    'Model-Lesson': model.lesson.Lesson,
    'Model-Question': model.question.Question,
    'Model-Student': model.student.Student,
    'Model-User': model.user.User,
}

# Generate wiki pages for apis.
with open('api.wiki', 'w') as f:
    for page_name, func_list in wiki_api.items():
        f.write('## ' + page_name)
        make_api_page(f, func_list)
        f.write('\n')

# Generate wiki pages for models.
with open('model.wiki', 'w') as f:
    for page_name, model_class in wiki_model.items():
        f.write('## ' + page_name)
        make_model_page(f, model_class)
        f.write('\n')

# Commit and push.
# sh = 'git add --all && git commit -m "Update Wiki" && git push'
# p = subprocess.Popen(sh, cwd=wiki_dir, shell=True)
# p.wait()

