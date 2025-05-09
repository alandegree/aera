"""add workflow_run_id index for message

Revision ID: b2602e131636
Revises: 63f9175e515b
Create Date: 2024-06-29 12:16:51.646346

"""
from alembic import op

import models as models

# revision identifiers, used by Alembic.
revision = 'b2602e131636'
down_revision = '63f9175e515b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.create_index('message_workflow_run_id_idx', ['conversation_id', 'workflow_run_id'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.drop_index('message_workflow_run_id_idx')

    # ### end Alembic commands ###
