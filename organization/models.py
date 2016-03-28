from django.db import models

# Create your models here.

class Colleague(models.Model):
    username = models.CharField(max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    manager = models.CharField(max_length=200, blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    region = models.CharField(max_length=200, blank=True, null=True)
    office = models.CharField(max_length=200, blank=True, null=True)
    organization = models.CharField(max_length=200, blank=True, null=True)
    team = models.CharField(max_length=200, blank=True, null=True)
    sub_team = models.CharField(max_length=200, blank=True, null=True)
    expertise = models.CharField(max_length=5000, blank=True, null=True)
    interests = models.CharField(max_length=5000, blank=True, null=True)
    fun_fact = models.CharField(max_length=5000, blank=True, null=True)
    photo = models.CharField(max_length=500, blank=True, null=True)
    # integer_relationship = models.PositiveSmallIntegerField(blank=True, null=True)

    def __unicode__(self):
        return self.username

    def hierarchy(self):
        workers = Colleague.objects.all()
        for i in workers:
            print i.manager
            if i.manager == "The Board":
                print i.username, "Leader"
                # i.integer_relationship = 1
                # i.save()
            else:
                count = 0

                parent = []
                parent.append(str(i.manager).split())
                print parent,"manager of ", i.username
                man = Colleague.objects.filter(first_name=parent[0][0])
                for j in man:
                    count += 1
                    print j.manager
                    if j.manager != 'The Board':
                        print i.username, "reports to", i.manager, "who reports to", j.manager


        return