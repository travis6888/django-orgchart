from django.contrib import admin
# Register your models here.
from django import forms
from django.forms import ModelForm
from importcsvadmin.admin import ImportCSVModelAdmin

from organization.models import Colleague


class ColleagueAdminImporter(forms.ModelForm):
    class Meta:
        model = Colleague
        fields = ('username',
                  'first_name',
                  'last_name',
                  'manager',
                  'title',
                  'region',
                  'office',
                  'organization',
                  'team',
                  'sub_team',
                  'expertise',
                  'interests',
                  'fun_fact',
                  'photo')


class ColleagueAdminForm(ModelForm):
    class Meta:
        model = Colleague
        fields = ('username',
                  'first_name',
                  'last_name',
                  'manager',
                  'title',
                  'region',
                  'office',
                  'organization',
                  'team',
                  'sub_team',
                  'expertise',
                  'interests',
                  'fun_fact',
                  'photo')

class ColleagueAdmin(ImportCSVModelAdmin):
    importer_class = ColleagueAdminImporter
    form = ColleagueAdminForm


admin.site.register(Colleague, ColleagueAdmin)
