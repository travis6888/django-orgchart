import json

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from organization.models import Colleague
from orgchart.settings import COMPANY_NAME, TOP_LEVEL


def check(data):
    if data:
        return data
    else:
        pass

def test(request):
    worker = Colleague.objects.all()
    # worker.hierarchy(worker.objects.first())
    extra_data = {}
    expertise = {}
    organization = {}
    team = {}
    region = {}
    office = {}
    interests = {}
    icon = {}
    links = []

    for i in worker:
        links.append((i.manager, '{} {}'.format(i.first_name, i.last_name)))
        extra_data['{} {}'.format(i.first_name, i.last_name)] = i.title
        expertise['{} {}'.format(i.first_name, i.last_name)] = i.expertise
        organization['{} {}'.format(i.first_name, i.last_name)] = i.organization
        region['{} {}'.format(i.first_name, i.last_name)] = i.region
        office['{} {}'.format(i.first_name, i.last_name)] = i.office
        interests['{} {}'.format(i.first_name, i.last_name)] = i.interests
        icon['{} {}'.format(i.first_name, i.last_name)] = i.photo

    parents, children = zip(*links)
    root_nodes = {x for x in parents if x not in children}
    for node in root_nodes:
        links.append(('RadiumOne', node))

    def get_nodes(node):

        print node

        d = {}
        d['name'] = node
        # add info here
        print d
        if node == COMPANY_NAME or node == TOP_LEVEL or node == '':
            pass
        else:

            d['extra'] = extra_data[node]
            d['expertise'] = expertise[node]
            d['organization'] = organization[node]
            d['region'] = region[node]
            d['office'] = office[node]
            d['interests'] = interests[node]
            d['icon'] = check(icon[node])
            print d['icon']

        children = get_children(node)
        if children:
            print node
            d['children'] = [get_nodes(child) for child in children]
        return d

    def get_children(node):
        return [x[1] for x in links if x[0] == node]

    tree = get_nodes('RadiumOne')
    # print json.dumps(tree, indent=4)
    return HttpResponse(json.dumps(tree), content_type='application/json')


def org(request):
    return render(request, 'index.html')