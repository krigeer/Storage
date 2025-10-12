import string
import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.core.validators import RegexValidator

solo_letras = RegexValidator(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$'),
