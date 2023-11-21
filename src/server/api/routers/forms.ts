import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { formTitle } from "@/utils/validation";
import { TRPCError } from "@trpc/server";
import { JsonValue } from "@prisma/client/runtime/library";

export const formRouter = createTRPCRouter({
  findResponseCountByFormId: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const responseCount = await ctx.db.formResponse.count({
        where: {
          form_id: input.form_id,
          Form: {
            ownerId: ctx.session.user.id,
          },
        },
      });

      return responseCount;
    }),
  publicFindById: publicProcedure
    .input(
      z.object({
        form_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.form.findUnique({
        where: {
          form_id: input.form_id,
        },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form does not exist!",
        });
      }

      return form;
    }),
  findById: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.form.findUnique({
        where: {
          form_id: input.form_id,
          ownerId: ctx.session.user.id,
        },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form does not exist!",
        });
      }

      return form;
    }),
  myForms: protectedProcedure.query(async ({ ctx }) => {
    const forms = await ctx.db.form.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        form_id: true,
        createdAt: true,
        title: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return forms;
  }),
  createForm: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { form_id } = await ctx.db.form.create({
        data: {
          title: input.title,
          formConfig: {},
          formSchema: {},
          ownerId: ctx.session.user.id,
        },
      });

      return { form_id };
    }),
  response: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
        values: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { form_response_id } = await ctx.db.formResponse.create({
        data: {
          form_id: input.form_id,
          values: input.values,
        },
      });

      return { form_response_id };
    }),

  getAllFormResponseIds: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const form_response_id = await ctx.db.formResponse.findMany({
        select: {
          form_response_id: true,
        },
        where: {
          form_id: input.formId,
          Form: {
            ownerId: ctx.session.user.id,
          },
        },
      });

      return form_response_id;
    }),

  getFormResponseById: protectedProcedure
    .input(
      z.object({
        form_response_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.db.formResponse.findUnique({
        where: {
          form_response_id: input.form_response_id,
          Form: {
            ownerId: ctx.session.user.id,
          },
        },
      });

      return response;
    }),

  updateFormData: protectedProcedure
    .input(
      z.object({
        form_response_id: z.string(),
        formData: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.formResponse.update({
        where: {
          form_response_id: input.form_response_id,
          Form: {
            ownerId: ctx.session.user.id,
          },
        },
        data: {
          values: input.formData,
        },
      });

      return response;
    }),

  deleteFormResponse: protectedProcedure
    .input(
      z.object({
        form_response_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.formResponse.delete({
        where: {
          form_response_id: input.form_response_id,
          Form: {
            ownerId: ctx.session.user.id,
          },
        },
      });

      return response;
    }),

  deleteForm: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let isSuccessful = false;
      try {
        await ctx.db.$transaction([
          ctx.db.formResponse.deleteMany({
            where: {
              form_id: input.form_id,
            },
          }),
          ctx.db.form.delete({
            where: {
              form_id: input.form_id,
              ownerId: ctx.session.user.id,
            },
          }),
        ]);

        isSuccessful = true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      } finally {
        await ctx.db.$disconnect();
      }

      return isSuccessful;
    }),
});
