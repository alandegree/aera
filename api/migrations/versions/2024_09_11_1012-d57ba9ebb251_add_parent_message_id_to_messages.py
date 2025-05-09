"""add parent_message_id to messages

Revision ID: d57ba9ebb251
Revises: 675b5321501b
Create Date: 2024-09-11 10:12:45.826265

"""
import sqlalchemy as sa
from alembic import op

import models as models

# revision identifiers, used by Alembic.
revision = 'd57ba9ebb251'
down_revision = '675b5321501b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('parent_message_id', models.types.StringUUID(), nullable=True))

    # Set parent_message_id for existing messages to uuid_nil() to distinguish them from new messages with actual parent IDs or NULLs
    op.execute('UPDATE messages SET parent_message_id = uuid_nil() WHERE parent_message_id IS NULL')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.drop_column('parent_message_id')

    # ### end Alembic commands ###
